export const articles = [
  {
    id: 1,
    title: 'Getting Started with Express.js',
    author: 'Alice Johnson',
    date: '2024-01-15',
    content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies routing, middleware integration, and request handling.',
  },
  {
    id: 2,
    title: 'Understanding Middleware in Express',
    author: 'Bob Smith',
    date: '2024-02-03',
    content: "Middleware functions are functions that have access to the request object, the response object, and the next middleware function in the application's request-response cycle. They can execute code, modify req/res, and call next().",
  },
  {
    id: 3,
    title: 'Template Engines: PUG vs EJS',
    author: 'Carol White',
    date: '2024-03-20',
    content: 'PUG (formerly Jade) uses indentation-based syntax for clean and concise HTML generation, while EJS allows embedding JavaScript directly in HTML templates using <% %> tags. Both are widely used in Node.js projects.',
  },
  {
    id: 4,
    title: 'Building REST APIs with Node.js',
    author: 'David Brown',
    date: '2024-04-10',
    content: 'REST APIs are the backbone of modern web applications. Using Express.js, you can quickly set up routes, handle HTTP methods, validate input, and return structured JSON responses to clients.',
  },
];
