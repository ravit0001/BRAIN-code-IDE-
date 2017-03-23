from django.shortcuts import render
from django.http import JsonResponse
import requests, datetime

RUN_URL = "http://api.hackerearth.com/code/run/"
CLIENT_SECRET_KEY = "178626ce7aedb3db18d2eb783dbaaa380cbedd9e"


def index(request):
    return render(request, 'braincodes/home1.html', {} )



def compile_and_run(request):
    if request.method == "POST" and request.is_ajax():
        data = {
            'client_secret': CLIENT_SECRET_KEY,
            'async': 0,
            'source': request.POST.get("source", " "),
            'lang': request.POST.get("lang", ""),
            'time_limit': 5,
            'memory_limit': 262144,
        }
        if request.POST.get("input", ""):
            data['input'] = request.POST.get("input", "")
        response_data = requests.post(RUN_URL, data=data)
        print (response_data.text)
        return JsonResponse(response_data.json(), safe=False)
    else:
        return render(request, "error.html", {"test": " Oops bad request !! "})

