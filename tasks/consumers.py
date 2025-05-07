import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Task
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware

class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("tasks", self.channel_name)
        print(f"WebSocket connected, added to group 'tasks': {self.channel_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("tasks", self.channel_name)
        print(f"WebSocket disconnected, removed from group 'tasks': {self.channel_name}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        await self.send(text_data=json.dumps({"message": "Echo: " + text_data_json["message"]}))

    @sync_to_async
    def get_tasks(self):
        tasks = list(Task.objects.all().values())
        for task in tasks:
            if 'created_at' in task and task['created_at']:
                task['created_at'] = task['created_at'].isoformat()
            if 'updated_at' in task and task['updated_at']:
                task['updated_at'] = task['updated_at'].isoformat()
        return tasks

    async def task_update(self, event):
        tasks = await self.get_tasks()
        # print(f"Sending task update to WebSocket clients: {tasks}")
        await self.send(text_data=json.dumps({
            "type": "task_update",
            "tasks": tasks
        }))