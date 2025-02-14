from django.db import migrations, models
import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('email', models.EmailField(help_text='Required. Must be a valid email address.', max_length=254, unique=True, verbose_name='email address')),
                ('nickname', models.CharField(blank=True, help_text='Optional. Max length 50 characters.', max_length=50, verbose_name='nickname')),
                ('avatar', models.ImageField(blank=True, help_text='Optional. User profile picture.', null=True, upload_to='avatars/', verbose_name='avatar')),
                ('bio', models.TextField(blank=True, help_text='Optional. Max length 500 characters.', max_length=500, verbose_name='biography')),
                ('is_verified', models.BooleanField(default=False, help_text='Indicates if the user has verified their email address.', verbose_name='verified')),
                ('last_login_ip', models.GenericIPAddressField(blank=True, help_text='The IP address of the last login.', null=True, verbose_name='last login IP')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='member_set', related_query_name='member', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='member_set', related_query_name='member', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'member',
                'verbose_name_plural': 'members',
                'db_table': 'member',
                'indexes': [
                    models.Index(fields=['email'], name='member_email_idx'),
                    models.Index(fields=['username'], name='member_username_idx'),
                    models.Index(fields=['created_at'], name='member_created_at_idx'),
                ],
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='MemberProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated at')),
                ('phone', models.CharField(blank=True, help_text='Optional. Phone number in international format.', max_length=20, verbose_name='phone number')),
                ('address', models.TextField(blank=True, help_text='Optional. Full address.', verbose_name='address')),
                ('birth_date', models.DateField(blank=True, help_text='Optional. Date of birth.', null=True, verbose_name='birth date')),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other'), ('N', 'Prefer not to say')], default='N', help_text='Optional. Gender identification.', max_length=1, verbose_name='gender')),
                ('preferences', models.JSONField(blank=True, default=dict, help_text='User preferences stored as JSON.', verbose_name='preferences')),
                ('member', models.OneToOneField(help_text='The member this profile belongs to.', on_delete=django.db.models.deletion.CASCADE, related_name='profile', to='member.member')),
            ],
            options={
                'verbose_name': 'member profile',
                'verbose_name_plural': 'member profiles',
                'db_table': 'member_profile',
                'indexes': [
                    models.Index(fields=['phone'], name='member_profile_phone_idx'),
                    models.Index(fields=['gender'], name='member_profile_gender_idx'),
                ],
            },
        ),
    ]