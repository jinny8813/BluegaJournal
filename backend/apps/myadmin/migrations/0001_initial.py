from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('member', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('action', models.CharField(choices=[('C', 'Create'), ('U', 'Update'), ('D', 'Delete'), ('L', 'Login'), ('O', 'Logout'), ('X', 'Other')], max_length=1, verbose_name='action')),
                ('model_type', models.CharField(max_length=50, verbose_name='model type')),
                ('object_id', models.CharField(max_length=50, verbose_name='object ID')),
                ('detail', models.JSONField(default=dict, verbose_name='detail')),
                ('ip_address', models.GenericIPAddressField(verbose_name='IP address')),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='admin_logs', to='member.member', verbose_name='admin')),
            ],
            options={
                'verbose_name': 'admin log',
                'verbose_name_plural': 'admin logs',
                'db_table': 'admin_log',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='AdminSetting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('key', models.CharField(max_length=50, unique=True, verbose_name='key')),
                ('value', models.JSONField(verbose_name='value')),
                ('description', models.TextField(blank=True, verbose_name='description')),
                ('is_active', models.BooleanField(default=True, verbose_name='active')),
            ],
            options={
                'verbose_name': 'admin setting',
                'verbose_name_plural': 'admin settings',
                'db_table': 'admin_setting',
                'ordering': ['key'],
            },
        ),
        migrations.AddIndex(
            model_name='adminlog',
            index=models.Index(fields=['admin'], name='admin_log_admin_idx'),
        ),
        migrations.AddIndex(
            model_name='adminlog',
            index=models.Index(fields=['action'], name='admin_log_action_idx'),
        ),
        migrations.AddIndex(
            model_name='adminlog',
            index=models.Index(fields=['created_at'], name='admin_log_created_at_idx'),
        ),
        migrations.AddIndex(
            model_name='adminsetting',
            index=models.Index(fields=['key'], name='admin_setting_key_idx'),
        ),
        migrations.AddIndex(
            model_name='adminsetting',
            index=models.Index(fields=['is_active'], name='admin_setting_active_idx'),
        ),
    ]