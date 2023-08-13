import asyncio
import websockets

def getLog(data):
    print('getLog', data)

    return 'getLog'

def getVersion(data):
    print('getVersion', data)

    return 'getVersion'

routes = {
    'blog': {
        'getLog': getLog,
        'getVersion': getVersion,
    },
}

async def echo(websocket, path):
    async for message in websocket:
        # Messages are in the format [route]>[function]>[data]
        
        split = message.split('>')
        route = split[0]
        function = split[1]
        
        # Call route
        res = routes[route][function](split[2])

        await websocket.send(res)

async def main():
    server = await websockets.serve(echo, "localhost", 8765)

    await server.wait_closed()

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
