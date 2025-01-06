/* General Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
}

/* Navbar */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #333;
    padding: 10px 20px;
    z-index: 1000;
}

.navbar ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
}

.navbar ul li {
    margin: 0 15px;
}

.navbar ul li a {
    text-decoration: none;
    color: white;
    font-weight: bold;
    padding: 5px 10px;
    transition: color 0.3s;
}

.navbar ul li a:hover {
    color: #f39c12;
}

/* Sections */
.section {
    padding: 100px 20px;
    text-align: center;
}

/* Gallery */
.gallery {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
}

.painting {
    cursor: pointer;
    text-align: center;
}

.painting img {
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
}

.painting img:hover {
    transform: scale(1.1);
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1001;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    position: relative;
}

.modal-content img {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
}
