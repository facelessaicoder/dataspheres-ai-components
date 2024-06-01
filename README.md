# WebComponents by Dataspheres AI

![Alpha Release](https://img.shields.io/badge/release-alpha-orange)

**Note:** This is an alpha release. The library is in active development and may contain bugs. Your feedback is welcome.

An open-source library for creating a group chat UI that supports human and AI interactions using Vanilla JavaScript and Web Components. This library includes text messaging, video chat, group chat, and document sharing functionalities with support for theming.

## Features
- Text messaging with AI and human interactions
- Video chat using WebRTC
- Document sharing
- Light and dark themes
- Customizable and extensible components

## Installation

**Note:** This is an alpha release. The library is in active development and may contain bugs. Your feedback is welcome.

To install the library, use npm:
```sh
npm install dataspheres-ai-components
```

## Usage

Here's an example of how to use the components in an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat App</title>
  <script type="module">
    import 'dataspheres-ai-components';
  </script>
  <link rel="stylesheet" href="path/to/light.css" id="theme-style">
</head>
<body>
  <chat-window></chat-window>
  <video-chat></video-chat>
  <document-sharing></document-sharing>

  <script>
    // Example: Switch to dark theme
    document.getElementById('theme-style').setAttribute('href', 'path/to/dark.css');
  </script>
</body>
</html>
```

## Contribution

We welcome contributions from the community. Please read the following guidelines before contributing.

## How to Contribute
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Submit a pull request.

## Code of Conduct
Please adhere to our Code of Conduct when participating in this project.

## License
This project is licensed under the MIT License.