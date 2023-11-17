import asyncio
import websockets
import html5lib
from git import Repo

repo = Repo('./blog/')
assert not repo.bare

# Endpoints
def attemptSave(data = None):
    # Get all files from the blog folder
    files = repo.git.ls_files().split('\n')
    
    # Iterate through all files
    for file in files:
        # Read file
        f = open('./blog/' + file, 'r')
        html = f.read()
        # Validate it is valid HTML
        try:
            html5parser = html5lib.HTMLParser(strict=True)
            html5parser.parse(html)
        except Exception as e:            
            return f"INVALID_HTML ({file}: {e})"
        finally:
            f.close()

    try:
        repo.git.add('--all')
        repo.git.commit('-m', 'autocommit')

        return "CHANGES_COMMITED"
    except:
        return "NO_CHANGES"    

def getLog(data = None):
    print('TODO getLog', data)

    return 'getLog'

def getVersions(data = None):
    return f"setVersions➝{repo.git.log('--pretty=format:%H|%cd', '--date=iso', '--', 'blog.html')}"

def getArticle(hash = None):    
    # Get the file at the specified hash
    content = repo.git.show(f'{hash}:blog.html')

    return f"setArticle➝{content}"

functions = {
    'attemptSave': attemptSave,
    'getLog': getLog,
    'getVersions': getVersions,
    'getArticle': getArticle,
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
    attemptSave(None) # Attempt to save as soon as the script runs
    server = await websockets.serve(rx, "localhost", 8765)

    await server.wait_closed()

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
