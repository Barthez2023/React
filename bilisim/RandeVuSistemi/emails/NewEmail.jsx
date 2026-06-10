import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

// Définition des styles en ligne (Inline Styles) au format objet JavaScript
const inlineStyles = {
  body: {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#212121',
    margin: '0',
    padding: '0',
  },
  container: {
    padding: '20px',
    margin: '0 auto',
    backgroundColor: '#eeeeee',
    maxWidth: '560px',
  },
  mainSection: {
    backgroundColor: '#ffffff',
  },
  headerSection: {
    backgroundColor: '#252f3d',
    display: 'flex',
    padding: '20px 0',
    verticalAlign: 'middle',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    padding: '25px 35px',
  },
  heading: {
    color: '#333333',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    marginTop: '0',
  },
  text: {
    color: '#333333',
    fontSize: '14px',
    lineHeight: '24px',
    marginTop: '24px',
    marginBottom: '14px',
    marginLeft: '0',
    marginRight: '0',
  },
  codeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '10px 0',
  },
  codeLabel: {
    color: '#333333',
    margin: '0',
    fontWeight: 'bold',
    fontSize: '14px',
    textAlign: 'center',
  },
  codeValue: {
    color: '#333333',
    fontSize: '36px',
    margin: '10px 0',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  codeValidity: {
    color: '#333333',
    fontSize: '14px',
    margin: '0',
    textAlign: 'center',
  },
  footerSection: {
    padding: '25px 35px',
  },
  footerText: {
    color: '#333333',
    fontSize: '14px',
    margin: '0',
  },
  bottomDisclaimer: {
    color: '#333333',
    fontSize: '12px',
    marginTop: '24px',
    marginBottom: '24px',
    marginLeft: '0',
    marginRight: '0',
    padding: '0 20px',
  },
  link: {
    color: '#2754c5',
    textDecoration: 'underline',
    fontSize: '14px',
  }
};

export default function NewEmail({ verificationCode }) {
  return (
    <Html lang="en">
      <Head />
      <Body style={inlineStyles.body}>
        <Preview>New Email Verification</Preview>
        <Container style={inlineStyles.container}>
          <Section style={inlineStyles.mainSection}>
            
            {/* Section Logo */}
            <Section style={inlineStyles.headerSection}>
              <Img
                src={`${baseUrl}/static/aws-logo.png`}
                width="75"
                height="45"
                alt="AWS's Logo"
              />
            </Section>

            {/* Section Contenu Principal */}
            <Section style={inlineStyles.contentSection}>
              <Heading style={inlineStyles.heading}>
                Verify your email address
              </Heading>
              <Text style={inlineStyles.text}>
                Thanks for starting the new AWS account creation process. We
                want to make sure it's really you. Please enter the following
                verification code when prompted. If you don&apos;t want to
                create an account, you can ignore this message.
              </Text>
              
              {/* Zone du Code de vérification */}
              <Section style={inlineStyles.codeContainer}>
                <Text style={inlineStyles.codeLabel}>
                  Verification code
                </Text>
                <Text style={inlineStyles.codeValue}>
                  {verificationCode}
                </Text>
                <Text style={inlineStyles.codeValidity}>
                  (This code is valid for 10 minutes)
                </Text>
              </Section>
            </Section>

            <Hr />

            {/* Section Alerte Sécurité */}
            <Section style={inlineStyles.footerSection}>
              <Text style={inlineStyles.footerText}>
                Amazon Web Services will never email you and ask you to
                disclose or verify your password, credit card, or banking
                account number.
              </Text>
            </Section>
          </Section>

          {/* Mentions Légales Bas de page */}
          <Text style={inlineStyles.bottomDisclaimer}>
            This message was produced and distributed by Amazon Web Services,
            Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web
            Services, Inc.. All rights reserved. AWS is a registered trademark
            of{' '}
            <Link
              href="https://amazon.com"
              target="_blank"
              style={inlineStyles.link}
            >
              Amazon.com
            </Link>
            , Inc. View our{' '}
            <Link
              href="https://amazon.com"
              target="_blank"
              style={inlineStyles.link}
            >
              privacy policy
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Configuration des propriétés par défaut pour la prévisualisation locale
NewEmail.PreviewProps = {
  verificationCode: '596853',
};