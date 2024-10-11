import asyncio

class EchoServerProtocol(asyncio.Protocol):

    def connection_made(self, transport):
        self.transport = transport
        peername = transport.get_extra_info('peername')
        print(f"Connection from {peername}")

    def data_received(self, data):
        message = data.decode()
        print(f"Data received: {message!r}")
        print(f"Send: {message!r}")
        self.transport.write(data)
        
    def connection_lost(self, exc):
        peername = self.transport.get_extra_info('peername')
        print(f"Connection with {peername} closed")
        if exc:
            print(f"Error: {exc}")  
       


async def run_server(host, port):
    server = await asyncio.start_server(
        EchoServerProtocol, host, port
    )
    async with server:
        await server.serve_forever()


async def main(host='127.0.0.1', port=8888):
   try:
     await run_server(host, port)
   except asyncio.CancelledError:
       print("Server shut down gracefully!")
   except Exception as e:
       print(f"Server error: {e}")   


if __name__ == "__main__":
    asyncio.run(main())
