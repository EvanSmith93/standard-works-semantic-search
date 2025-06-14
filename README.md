# Gospel Library Semantic Search

A semantic search application for the Gospel Library, built with Remix and Pinecone. This application allows users to search through Latter-day Saint scriptures and other church materials using natural language queries.

## Features

- Semantic search across all volumes of Latter-day Saint scriptures
- Volume selection to narrow search scope
- Modern UI built with Ant Design and Tailwind CSS
- Fast and relevant search results powered by Pinecone vector database

## Data Source

The scripture database came from [api.nephi.org](https://github.com/beandog/api.nephi.org), which provides a comprehensive SQLite database containing all Latter-day Saint scriptures. This includes:

- King James Version of the Bible
- Book of Mormon
- Doctrine & Covenants
- Pearl of Great Price

## Environment Setup

Create a `.env` file in the root directory similar to the `.env.example` file:

## Development

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Tech Stack

- [Remix](https://remix.run/) - Full stack web framework
- [Pinecone](https://www.pinecone.io/) - Vector database for semantic search
- [Ant Design](https://ant.design/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [SQLite](https://sqlite.org/) - Standard database with scripture information from [api.nephi.org](https://github.com/beandog/api.nephi.org)

## License

This project is not an official website of The Church of Jesus Christ of Latter-day Saints.
