import asyncio
import websockets

def getLog(data):
    print('getLog', data)

    return 'getLog'

def getVersion(data):
    print('getVersion', data)

    return 'getVersion'

functions = {
    'getLog': getLog,
    'getVersion': getVersion,
}

async def echo(websocket, path):
    async for message in websocket:
        # Messages are in the format [function]>[data]
        
        split = message.split('>')
        function = split[0]
        data = split[1]
        
        # Call route
        res = functions[function](data)

        await websocket.send(res)

async def main():
    server = await websockets.serve(echo, "localhost", 8765)

    await server.wait_closed()

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
