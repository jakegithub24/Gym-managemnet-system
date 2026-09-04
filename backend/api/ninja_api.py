from ninja import NinjaAPI

api = NinjaAPI(title='Gym Management API', version='1.0.0')

@api.get('/health', tags=['system'])
def health(request):
    return {'status': 'ok'}
