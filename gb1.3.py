import asyncio
import json

DELIMITER = "$"

class Connection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self._reader = None
        self._writer = None

    async def __aenter__(self):
        self._reader, self._writer = await asyncio.open_connection(self.host, self.port)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self._writer.close()
        await self._writer.wait_closed()

    async def read(self, n=-1):
       try:
           data = await self._reader.read(n)
           return data
       except asyncio.IncompleteReadError as e:
            print(f"Error while reading data: {e}")
            return None

    async def readline(self):
         try:
            data = await self._reader.readline()
            return data
        except asyncio.IncompleteReadError as e:
            print(f"Error while reading line: {e}")
            return None

    async def write(self, data):
          try:
            self._writer.write(data)
            await self._writer.drain()
        except Exception as e:
            print(f"Error while writing data: {e}")

    async def writelines(self, data):
         try:
            self._writer.writelines(data)
            await self._writer.drain()
        except Exception as e:
            print(f"Error while writing lines: {e}")


class NodeClient:
    def __init__(self, host, port, node_id, timeout=None, node=None):
        self.host = host
        self.port = port
        self.node_id = node_id
        self.timeout = timeout
        if node:
            self.node_host = node.host
            self.node_port = node.port

    async def _request(self, command, data=None):
        async with Connection(self.host, self.port) as conn:
            await conn.write(bytes(command, "utf-8") + b"\n")
            if data:
                await conn.write(bytes(json.dumps(data), "utf-8") + b"\n")
            _ = await conn.readline()  # Discard the first line
            response = await conn.readline()
            return response

    async def set(self, key, value, timeout=None):
        timeout = timeout or self.timeout
        return await asyncio.wait_for(self._request(f"set{DELIMITER}{key} {value}"), timeout)


    async def get(self, key, timeout=None):
        timeout = timeout or self.timeout
        return await asyncio.wait_for(self._request("get", {"key": key}), timeout)


    async def join(self, host, port, timeout=None):
        timeout = timeout or self.timeout
        return await asyncio.wait_for(self._request("join", {"host": host, "port": port}), timeout)

    async def vote(self, **kwargs):
        response = await self._request("vote", kwargs)
        try:
              return json.loads(response.decode().strip()) if response else {}
        except json.JSONDecodeError:
            print("Error decoding JSON response")
            return {}

async def main():
    host, port = "127.0.0.1", 8888
    client = NodeClient(host, port, 1)

    print("Sending messages..")
    await client.get("yas")
    await client.set("yasho", 1)
    await client.join("127.9.2.2", 9090)


if __name__ == "__main__":
    asyncio.run(main())
