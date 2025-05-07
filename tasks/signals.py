from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Task

@receiver(post_save, sender=Task)
@receiver(post_delete, sender=Task)
def notify_task_update(sender, instance, **kwargs):
    print(f"Signal triggered for task {instance.id}")
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "tasks",
        {
            "type": "task_update",
        }
    )