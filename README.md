# Personal Portfolio Website

A modern, responsive portfolio website showcasing my professional experience, projects, and skills. The website features a sleek dark theme with smooth animations and interactive elements.

## Features

- **Modern Dark Theme**: Elegant dark color scheme with glowing accents
- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: 
  - Fade-in animations on scroll
  - Interactive hover effects
  - Smooth scrolling navigation
- **Sections**:
  - Intro screen with animated logo
  - About Me with skills showcase
  - Experience timeline
  - Project showcase
  - Contact information

## Technologies Used

- HTML5
- CSS3 (Custom properties, Flexbox, Grid)
- JavaScript (ES6+)
- Font Awesome 6.4.0 for icons
- Inter font family from Google Fonts
- Intersection Observer API for scroll animations

## Setup and Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Navigate to the project directory:
```bash
cd [project-directory]
```

3. Start a local server:
```bash
python3 -m http.server
```

4. Open your browser and visit:
```
http://localhost:8000
```

## Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Main stylesheet
├── js/
│   └── main.js            # JavaScript functionality
├── images/                # Image assets
└── sections/             # HTML section components
    ├── about.html
    ├── experience.html
    ├── projects.html
    ├── contact.html
    └── footer.html
```

## Customization

### Colors
The website uses CSS custom properties for easy color customization. Main colors can be modified in `styles/main.css`:

```css
:root {
    --primary: #5bbfba;
    --primary-dark: #48a09c;
    --bg-dark: #000000;
    --bg-medium: #111111;
    --bg-light: #1a1a1a;
    --text-light: #ffffff;
    --text-muted: #888888;
}
```

### Content
- Update personal information in `index.html`
- Modify section content in respective files under the `sections/` directory
- Add/remove skills in `sections/about.html`
- Update projects in `sections/projects.html`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Optimized images
- Efficient CSS animations
- Lazy loading for images
- Minimal JavaScript usage
- No external dependencies except Font Awesome and Google Fonts

## Contributing

Feel free to fork this project and customize it for your own use. If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Shivom Vinayak Raskar
- Email: shivom192003@gmail.com
- LinkedIn: [Shivom VR](https://www.linkedin.com/in/shivom-vr-69495420)
- GitHub: [Shivom2110](https://github.com/Shivom2110) 