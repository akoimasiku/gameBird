def hash_string(s, base=256, prime=101):
    hash_val = 0
    
    for char in s:
        hash_val = (hash_val * base + ord(char)) % prime
    return hash_val


def search(text, patt):
    base = 256
	prime = 101
    patt_len = len(patt)
    text_len = len(text)

    patt_hash = hash_string(patt, base, prime)
    text_hash = hash_string(text[:patt_len], base, prime)

    base_pow = pow(base, patt_len - 1, prime)  # Precompute base^m % prime

    result = []

    for i in range(text_len - patt_len + 1):
        # Check if hashes are the same
        if patt_hash == text_hash:
            # Verify by direct string comparison
            if text[i:i + patt_len] == patt:
                result.append(i)

        # Calculate hash for the next window
        if i < text_len - patt_len:
            text_hash = (text_hash - ord(text[i]) * base_pow) * base + ord(text[i + patt_len])
            text_hash %= prime 

    if result:
        print(f"Pattern found at indices: {result}")
    else:
        print("Pattern not found")


text = 'abbacdadbhabbagpfoe'
patt = 'abba'
search(text, patt)
