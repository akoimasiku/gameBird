#include <iostream>

using namespace std;

int calculate_moves(int n, int m) {
    if (m % 2 == 0) {
        return n * (m / 2);
    } else {
        return (n * (m - 1) / 2) + (n + 1) / 2;
    }
}

int main() {
    int t;
    cin >> t;
	
    while (t--) {
		int n, m;
        cin >> n >> m;
		
		if (n <= 0 || m <= 0){
			cout <<"Invalid input. Both n and m must be positive." << "\n";
		}else {
        cout << calculate_moves(n, m) << "\n";
		}
    }
    return 0;
}
