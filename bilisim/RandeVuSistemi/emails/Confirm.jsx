import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'react-email';

const styles = {
  body: {
    backgroundColor: '#f3f6fb',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
    margin: '0',
    padding: '30px 0',
  },

  container: {
    backgroundColor: '#ffffff',
    maxWidth: '620px',
    margin: '0 auto',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 15px rgba(15,23,42,0.08)',
  },

  header: {
    background:
      'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    textAlign: 'center',
    padding: '35px 25px',
  },

  head: {
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: '700',
    margin: '0',
  },

  hospitalSubtitle: {
    color: '#dbeafe',
    fontSize: '14px',
    marginTop: '8px',
  },

  content: {
    padding: '35px',
  },

  badge: {
    // backgroundColor: '#dcfce7',
    color: '#15803d',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 18px',
    borderRadius: '999px',
    fontSize: '30px',
    fontWeight: '600',
    marginBottom: '20px',
  },

  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: '25px',
  },

  paragraph: {
    fontSize: '16px',
    lineHeight: '28px',
    color: '#475569',
    marginBottom: '16px',
  },

  card: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '25px',
    marginTop: '30px',
    marginBottom: '30px',
  },

  cardTitle: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '18px',
  },

  row: {
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0',
  },

  label: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
  },

  value: {
    fontSize: '15px',
    color: '#0f172a',
    fontWeight: '700',
  },

  note: {
    backgroundColor: '#eff6ff',
    borderLeft: '4px solid #2563eb',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '25px',
    fontSize: '14px',
    lineHeight: '22px',
    color: '#334155',
  },

  buttonSection: {
    textAlign: 'center',
    marginTop: '30px',
    marginBottom: '20px',
  },

  button: {
    background:
      'linear-gradient(135deg,#2563eb,#0ea5e9)',
    color: '#ffffff',
    padding: '14px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '15px',
    display: 'inline-block',
  },

  footer: {
    borderTop: '1px solid #e2e8f0',
    padding: '25px',
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },

  footerText: {
    color: '#94a3b8',
    fontSize: '12px',
    lineHeight: '20px',
    margin: '4px 0',
  },
};

export default function Confirm({
  patientName,
  appointmentDate,
  departmentName,
  hospitalName,
  time,
  ville,
}) {
  const dateObj = appointmentDate
    ? new Date(appointmentDate)
    : new Date();

  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
  }).format(dateObj);

  const formattedTime = new Intl.DateTimeFormat('fr-FR', {
    timeStyle: 'short',
  }).format(dateObj);

  return (
    <Html lang="fr">
      <Head />

      <Preview>
        Tıbbi randevunuz onaylandı.
      </Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          
          {/* HEADER */}
          <Section style={styles.header}>
            <Heading style={styles.head}>
                {'Randevu Onay Bildirimi'}
            </Heading>

            <Text style={styles.hospitalSubtitle}>
              Sağlığınız, önceliğimizdir.
            </Text>
          </Section>

          {/* CONTENT */}
          <Section style={styles.content}>
            
            <div style={styles.badge}>
              ✓ Randevu Alindi
            </div>

            <Text style={styles.paragraph}>
              Sayin <strong>{patientName}</strong>,
            </Text>

            <Text style={styles.paragraph}>
              Randevunuzun sistemimize başarıyla kaydedildiğini 
              memnuniyetle teyit ederiz.
            </Text>

            {/* CARD */}
            <Section style={styles.card}>
              <Text style={styles.cardTitle}>
                Randevu Bilgileri
              </Text>

              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
              >
                <tbody>
                  <tr>
                    <td style={styles.row}>
                      <span style={styles.label}>
                        Tıbbi bölüm
                      </span>
                    </td>

                    <td
                      align="right"
                      style={styles.row}
                    >
                      <span style={styles.value}>
                        {departmentName}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td style={styles.row}>
                      <span style={styles.label}>
                        Tarih
                      </span>
                    </td>

                    <td
                      align="right"
                      style={styles.row}
                    >
                      <span style={styles.value}>
                        {formattedDate}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        paddingTop: '12px',
                      }}
                    >
                      <span style={styles.label}>
                        Zaman
                      </span>
                    </td>

                    <td
                      align="right"
                      style={{
                        paddingTop: '12px',
                      }}
                    >
                      <span style={styles.value}>
                        {time}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        paddingTop: '12px',
                      }}
                    >
                      <span style={styles.label}>
                        Adres
                      </span>
                    </td>

                    <td
                      align="right"
                      style={{
                        paddingTop: '12px',
                      }}
                    >
                      <span style={styles.value}>
                            {ville}
                      </span>
                    </td>
                  </tr>
                   <tr>
                    <td
                      style={{
                        paddingTop: '12px',
                      }}
                    >
                      <span style={styles.label}>
                        Hastane
                      </span>
                    </td>

                    <td
                      align="right"
                      style={{
                        paddingTop: '12px',
                      }}
                    >
                      <span style={styles.value}>
                            {hospitalName}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* INFO BOX */}
            <div style={styles.note}>
                ℹ️ Randevunuzu değiştirmek veya
                iptal etmek isterseniz, lütfen
                planlanan tarihten en az 24 saat önce
                bunu yapın.
            </div>

            {/* BUTTON */}
            <Section style={styles.buttonSection}>
              <Button
                href="https://mhr.today/espace-patient"
                style={styles.button}
              >
                Randevumu yönet
              </Button>
            </Section>
          </Section>

          {/* FOOTER */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © 2026 {hospitalName}
            </Text>

            <Text style={styles.footerText}>
              Bu e-posta otomatik olarak oluşturulmuştur.
            </Text>

            <Text style={styles.footerText}>
              Lütfen bu mesaja doğrudan yanıt vermeyin.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

Confirm.PreviewProps = {
  patientName: 'Valorie Barthez',
  appointmentDate: new Date(
    '2026-06-15'
  ),
  time: '12:30',
  departmentName: 'Cardiologie',
  hospitalName: 'Hôpital MHR de Konya',
  ville: 'Konya',
};