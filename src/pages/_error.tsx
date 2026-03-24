import type { NextPageContext } from "next";

interface ErrorPageProps {
  statusCode?: number;
}

function ErrorPage({ statusCode }: ErrorPageProps) {
  const title =
    statusCode && statusCode >= 500
      ? "Serverfehler"
      : statusCode === 404
        ? "Seite nicht gefunden"
        : "Etwas ist schiefgelaufen";

  return (
    <main
      style={{
        alignItems: "center",
        display: "flex",
        fontFamily: "system-ui, sans-serif",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <p style={{ color: "#0057B8", fontSize: "0.875rem", fontWeight: 700 }}>
          {statusCode ? `Fehler ${statusCode}` : "Fehler"}
        </p>
        <h1 style={{ color: "#111827", fontSize: "2rem", margin: "0.5rem 0 1rem" }}>
          {title}
        </h1>
        <p style={{ color: "#6B7280", lineHeight: 1.6 }}>
          Die Seite konnte gerade nicht geladen werden. Bitte versuche es gleich noch
          einmal.
        </p>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;
