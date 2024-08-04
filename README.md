# CodeQuill

[![CodeQuill](https://img.shields.io/badge/CodeQuill-Code%20Editor%20and%20Storage-blue)](https://github.com/codingwithkid/codequill)

<!-- [![Logo](app/favicon.ico)](https://github.com/The-Best-Codes/codequill) -->

<img src=".assets/codequill_main_logo.png" alt="logo" for="cover" />

## How to install CodeQuill on Linux

Installing CodeQuill on Linux (Ubuntu is preferred) is straightforward.

### Using the installer

Download the install file here:<br>
[https://github.com/The-Best-Codes/codequill/blob/main/codequill_app.sh](https://github.com/The-Best-Codes/codequill/blob/main/codequill_app.sh)<br>
_Click the download button in the top right of the editor._

If the download doesn't happen automatically, open the URL and save the page manually (right click and select "Save page as" or Press `CTRL + S`).

Rigth click on the file, then select properties, and turn on "Allow executing as a program". Right click on the file again and select "Run as a progam".

### Manual installation

1. Open a terminal on your device.

2. Navigate to your home directory:
   ```
   cd ~
   ```

3. Download the installation script using curl:
   ```
   curl -O https://raw.githubusercontent.com/The-Best-Codes/codequill/main/.device_scripts/codequill.sh
   ```

4. Make the downloaded script executable:
   ```
   chmod +x codequill.sh
   ```

5. Run the installation script:
   ```
   ./codequill.sh
   ```

6. Wait for the installation process to complete. The script will install CodeQuill and any necessary dependencies.

7. Once the installation is finished, you should be able to use CodeQuill on your device.

---

CodeQuill is a web-based code editor designed to offer a free, easy, and efficient way to organize, store, edit, and share code snippets directly from your device. Whether you're working on personal projects or simply storing snippets for future reference, CodeQuill provides a seamless experience for managing your code.

## Features

- **Syntax Highlighting:** Enjoy coding with syntax highlighting that supports multiple languages.
- **Code Storage:** Save your snippets in the a local database for easy access anywhere on your network.
- **Share**: Share your code snippets with other devices on your network to easily transfer codes.
- **Comfortable Interface:** The editor is designed to be as intuitive and familiar as possible. The experience should remind you of working in VS Code.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- A modern web browser

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/The-Best-Codes/codequill.git
   cd codequill
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Initialize the database:

   ```bash
   node scripts/init-db.js
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the CodeQuill interface by opening `http://localhost:3000` in your web browser.

### Building for Production

To deploy CodeQuill for production use:

```bash
npm run build && npm start
```

This command builds the application for optimal performance and starts the production server.

## Contributing

We welcome contributions to CodeQuill! Whether you're looking to fix bugs, add new features, or improve documentation, please feel free to submit a pull request.

## License

CodeQuill is released under the MIT License. See the LICENSE file for more details.

## Support

For support or to report issues, please visit the [issues page](https://github.com/The-Best-Codes/codequill/issues).

Thank you for considering CodeQuill for your coding needs!
