import asyncio
import websockets
from git import Repo

repo = Repo('./blog/')
assert not repo.bare

def repoHasChanges():
    repo_status = repo.git.status()
    print("Repo status:", repo_status)

    return 'nothing to commit, working tree clean' not in repo_status

# Endpoints
def attemptSave(data):
    print('attemptSave', data)

    # Check if there are changes
    if repoHasChanges():
        repo.git.add('--all')
        repo.git.commit('-m', 'autocommit')

        return 'COMMIT_SUCCESS'
    else:
        return 'NOTHING_TO_COMMIT'

def getLog(data):
    print('TODO getLog', data)

    return 'getLog'

def getVersions(data):
    print('TODO getVersions', data)

    return 'getVersions'

functions = {
    'attemptSave': attemptSave,
    'getLog': getLog,
    'getVersions': getVersions,
}

async def rx(websocket, path):
    async for message in websocket:
        # Messages are in the format "function➝[data]"
        
        split = message.split('➝')
        function = split[0]
        data = split[1]
        
        # Call route
        res = functions[function](data)

        await websocket.send(res)

async def main():
    attemptSave() # Attempt to save as soon as the script runs
    server = await websockets.serve(rx, "localhost", 8765)

    await server.wait_closed()

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
