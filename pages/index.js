import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';

export default function Home() {
  const [domainstring, setDomainString] = useState('')
  const [results, setResults] = useState([])
  const api_token = process.env.NEXT_PUBLIC_API_NINJA_TOKEN
  const api_url = "https://api.api-ninjas.com/v1/whois?domain="

  const getResult = async (domain) => {
    const result = await fetch(api_url + domain, {
      method: "GET",
      headers:  {
        "X-Api-Key": api_token
      },
      referrerPolicy: 'no-referrer',
    })
    const data = await result.json()
    setResults(results => (
      [...results, empty_object(data) ? {available: true, domain: domain} : {available: false, domain: domain}]
    ))
    return result
  }

  const sanitize = (domain) => (
    domain.split(".").length > 1 ? domain : domain+".com"
  )

  const findDomains = () => {
    setResults([])
    const domains = domainstring.split(/\s+/)
    domains.forEach(domain => {
      const sanitized_domain = sanitize(domain)
      // make request to api and get the results
      getResult(sanitized_domain)
    });
  }

  const empty_object = (object) => (JSON.stringify(object) === "{}")

  return (
    <div className={styles.container}>
      <Head>
        <title>Who Is and Who Is Not</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Welcome
        </h1>

        <p className={styles.description}>
          Please insert the domain name or names that you want to check
        </p>
        <p className={styles.description}>
          <code>
            Make sure the names end with the proper extensions like .com, .net etc. and separated by a whitespace
          </code>
        </p>

        <div className={styles.grid}>
          <textarea
            placeholder='Enter the list here'
            className={styles.textarea}
            onChange={(e) => setDomainString(e.target.value)}
            />

        <div style={{marginLeft: "20px", marginBottom: "auto"}}>
          {
            results.length > 0 && (
              <>
                <table border="1">
                  <thead>
                    <th>Domain</th>
                    <th>Availability</th>
                  </thead>

                  <tbody>
                    {
                      results.map(result => (
                        <tr>
                          <td>{result.domain}</td>
                          <td className={result.available ? 'green' : 'red'}>{result.available ? "Available" : "Unavailable"}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </>
            )
          }
        </div>
        </div>

        <button className={styles.submit} onClick={findDomains}>
          Submit
        </button>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
        td {
          width: 200px;
          padding: 15px;
        }
        .red {
          background-color: red;
          color: white;
        }
        .green {
          background-color: green;
          color: white;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
