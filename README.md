> Open this page
> at [https://abaire.github.io/MakeCodeArcade_Extensions/](https://abaire.github.io/MakeCodeArcade_Extensions/)

## Use as Extension

This repository can be added as an extension in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/abaire/MakeCodeArcade_Extensions** and import

## Edit this extension

To edit this repository in MakeCode:

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/abaire/MakeCodeArcade_Extensions** and click import

### Development Environment Setup (Isolated / No Local Node.js)

To prevent cluttering the host system and to avoid security risks associated with local Node.js/npm tooling
dependencies, this repository uses a containerized environment powered by **Colima** and **Docker**, managed directly
inside **WebStorm** (or IntelliJ IDEA Ultimate).

The MakeCode compiler and its targets are cached safely inside a local Docker image. By isolating the environment target
above the workspace mount point, reproducible, sub-second builds are achieved with absolutely zero `node_modules`
footprint spilling onto the host machine. The build script automatically resolves missing dependencies without
penalizing the hot-path compilation time.

#### Prerequisites

1. **Colima** installed and running on macOS (`brew install colima && colima start`).
2. **WebStorm** or **IntelliJ IDEA Ultimate**.

#### Step 1: Initialize the Local Docker Image

Before configuring the IDE, build the persistent compiler image from the root directory. This only needs to be run once:

```zsh
docker build -t makecode-arcade-env .
```

#### Step 2: WebStorm Integration Steps

Follow these steps to wire up the build pipeline to the native UI execution controls in WebStorm.

##### 1. Connect WebStorm to Colima

Before running build commands, the IDE needs to communicate with your local container runtime socket:

* Open WebStorm and navigate to **Settings** (`Cmd + ,`) > **Build, Execution, Deployment** > **Docker**.
* Click the **`+`** icon to add a new Docker registry configuration.
* Select **Unix socket** and provide the path to your Colima instance (generally the IDE will populate this
  automatically):
    ```text
    unix://$HOME/.colima/default/docker.sock
    ```
* Ensure the status message at the bottom displays `Connection successful`.

##### 2. Configure the UI Build Action

* In the top-right toolbar of WebStorm, click the run configurations dropdown and choose **Edit Configurations...** (or
  go to **Run** > **Edit Configurations...**).
* Click the **`+`** icon in the top-left corner and select **Shell Script**.
* Configure the script fields as follows:
    * **Name:** `MakeCode: Build Extension`
    * **Execute:** Select **Script file**
    * **Script path:** Point this to `build.sh` in your project root.
    * **Working directory:** Ensure this points to your project root (typically preset to `$PROJECT_DIR$`).
    * *(Ensure "Script options" is left empty, as the script defaults to the project root).*
* Click **Apply** and then **OK**.

##### 3. Running the Compilation Pipeline

* Select `MakeCode: Build Extension` from the configuration dropdown in the top toolbar.
* Click the green **Run** icon ($\blacktriangleright$) or use the keyboard shortcut `Ctrl + R` (macOS keymap) /
  `Shift + F10`.
* The IDE will compile the extension instantly.

---

#### Metadata (used for search, rendering)

* for PXT/arcade

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender('{{ site.makecode.home_url }}', '{{ site.github.owner_name }}/{{ site.github.repository_name }}');</script>