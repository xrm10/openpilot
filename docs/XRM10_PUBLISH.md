# XRM10 publish commands

Run these from the repository root after `https://github.com/xrm10/openpilot`
exists and GitHub authentication is available locally.

```powershell
& 'C:\Users\Hp\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe' remote -v
& 'C:\Users\Hp\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe' status --short --branch
& 'C:\Users\Hp\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd\git.exe' push -u xrm10 dev
```

After the push succeeds, verify:

```text
https://github.com/xrm10/openpilot/tree/dev
```

Then use this comma four custom software URL:

```text
https://installer.comma.ai/xrm10/dev
```

If GitHub authentication is not configured, the push will fail with a username
or credential prompt. Sign in through GitHub Desktop or install/authorize the
GitHub CLI, then rerun the push.

