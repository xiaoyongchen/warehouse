import requests

url = 'https://api.github.com/search/repositories?q=language:python&sort=stars&page=1&size=1'
res = requests.get(url)
resJson = res.json()
print(resJson['items'][0])

# 接下来处理数据，进行一些可视化操作