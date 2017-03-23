from django.shortcuts import render
from django.http import JsonResponse
import requests, datetime

RUN_URL = "http://api.hackerearth.com/code/run/"
CLIENT_SECRET_KEY = "0cd8c796eb2f2510e1a567a2c578427afbe4506c"


def index(request):
    return render(request, 'braincodes/home1.html')



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
        return JsonResponse(response_data.json(), safe=False)
    else:
        return render(request, "error.html", {"test": " Oops bad request !! "})

