import React, { useState } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard({ user, reports, onLogout }) {
  const [activeReport, setActiveReport] = useState(reports.length > 0 ? reports[0] : null);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.title}>Demo Organization</div>
        </div>
        
        <div className={styles.nav}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
          <button className={styles.logoutBtn} onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Dashboards Disponíveis</h2>
          {reports.map(report => (
            <button 
              key={report.id}
              className={`${styles.reportBtn} ${activeReport?.id === report.id ? styles.active : ''}`}
              onClick={() => setActiveReport(report)}
            >
              {report.title}
            </button>
          ))}
          {reports.length === 0 && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Nenhum relatório disponível.</p>
          )}
        </aside>

        <section className={styles.content}>
          <div className={styles.iframeWrapper}>
            {activeReport ? (
              <iframe 
                className={styles.iframe}
                title={activeReport.title}
                src={activeReport.url}
                frameBorder="0"
                allowFullScreen={true}
              ></iframe>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
                Selecione um dashboard para visualizar.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
