import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  // Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function VerifyMagicLink({
  host,
  url,
}: {
  host: string;
  url: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>
        Platform pelatihan bahasa asing dan sertifikasi untuk karier profesional
        di luar negeri.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* <Img
            src={`${env.FRONTEND_URL}/logo.png`}
            width="170"
            height="50"
            alt="Gawwe"
            style={logo}
          /> */}
          <Text style={paragraph}>Login ke {host},</Text>
          <Text style={paragraph}>
            Selamat Datang di Gawwe.Id. Platform pelatihan bahasa asing dan
            sertifikasi untuk karier profesional di luar negeri.
          </Text>
          <Text style={paragraph}>
            Klik tombol dibawah untuk verifikasi email Anda.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={url}>
              Verifikasi Email
            </Button>
          </Section>
          <Text style={paragraph}>
            Salam,
            <br />
            Gawwe Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>BSD, Tangerang, Indonesia</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#fa541c",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
