import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

// Hex equivalents of the app's oklch() brand palette. Email clients do not
// support oklch(), so these are pre-converted rather than referenced from CSS.
const COLORS = {
  bg: "#060a0e", // oklch(14% 0.012 250)
  card: "#12171b", // oklch(20% 0.012 250)
  surface: "#1b2025", // oklch(24% 0.012 250)
  border: "#292e34", // oklch(30% 0.012 250)
  dim: "#5e646a", // oklch(50% 0.012 250)
  muted: "#b2b8bf", // oklch(78% 0.012 250)
  text: "#ebeff2", // oklch(95% 0.006 250)
  lime: "#7fd146", // oklch(78% 0.19 135)
}

const DISPLAY_STACK =
  "'Unbounded', 'Helvetica Neue', Helvetica, Arial, sans-serif"
const BODY_STACK = "'Manrope', 'Helvetica Neue', Helvetica, Arial, sans-serif"

export interface InviteEmailProps {
  eventName: string
  dateLine: string
  location: string
  tierLabel: string
  description?: string | null
  imageUrl?: string | null
  eventUrl: string
  goingUrl: string
  maybeUrl: string
  notGoingUrl: string
  recipientName?: string | null
}

export function InviteEmail({
  eventName,
  dateLine,
  location,
  tierLabel,
  description,
  imageUrl,
  eventUrl,
  goingUrl,
  maybeUrl,
  notGoingUrl,
  recipientName,
}: InviteEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Unbounded"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/unbounded/v6/Yq6F-LOTXCb04q32xlpat-6uR42XTqtG6xjx.woff2",
            format: "woff2",
          }}
          fontWeight={800}
          fontStyle="normal"
        />
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{`You're invited: ${eventName} — ${dateLine}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>SENDIT</Text>

          <Section style={card}>
            {imageUrl ? (
              <Img
                src={imageUrl}
                alt={eventName}
                width="560"
                style={heroImage}
              />
            ) : null}

            <Section style={cardBody}>
              <Text style={eyebrow}>YOU&rsquo;RE INVITED</Text>
              <Heading as="h1" style={heading}>
                {eventName}
              </Heading>
              <Text style={details}>
                {dateLine}
                <br />
                {location}
                <br />
                {tierLabel}
              </Text>
              {description ? (
                <Text style={descriptionText}>{description}</Text>
              ) : null}
            </Section>
          </Section>

          <Section style={rsvpBlock}>
            <Text style={rsvpPrompt}>
              {recipientName ? `${recipientName}, will you` : "Will you"}{" "}
              attend?
            </Text>
            <Row>
              <Column style={buttonCell}>
                <Button href={goingUrl} style={primaryButton}>
                  Going
                </Button>
              </Column>
              <Column style={buttonCell}>
                <Button href={maybeUrl} style={secondaryButton}>
                  Maybe
                </Button>
              </Column>
              <Column style={buttonCell}>
                <Button href={notGoingUrl} style={secondaryButton}>
                  Can&rsquo;t go
                </Button>
              </Column>
            </Row>
            <Text style={oneClickNote}>
              One click replies instantly — you can change it afterwards.
            </Text>
          </Section>

          <Section style={{ textAlign: "center" as const }}>
            <Link href={eventUrl} style={detailsLink}>
              View full invite &rarr;
            </Link>
          </Section>

          <Hr style={divider} />
          <Text style={footer}>
            You received this because you were invited to {eventName}.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default InviteEmail

const main = {
  backgroundColor: COLORS.bg,
  fontFamily: BODY_STACK,
  margin: 0,
  padding: "24px 0",
}

const container = {
  backgroundColor: COLORS.bg,
  margin: "0 auto",
  maxWidth: "600px",
  padding: "0 20px",
  width: "100%",
}

const brand = {
  color: COLORS.dim,
  fontFamily: DISPLAY_STACK,
  fontSize: "14px",
  fontWeight: 800,
  letterSpacing: "0.02em",
  margin: "0 0 16px",
  textAlign: "center" as const,
}

const card = {
  backgroundColor: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  borderRadius: "16px",
  overflow: "hidden" as const,
}

const heroImage = {
  display: "block",
  height: "auto",
  objectFit: "cover" as const,
  width: "100%",
}

const cardBody = {
  padding: "28px",
}

const eyebrow = {
  color: COLORS.lime,
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: "11px",
  letterSpacing: "0.12em",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
}

const heading = {
  color: COLORS.text,
  fontFamily: DISPLAY_STACK,
  fontSize: "30px",
  fontWeight: 800,
  lineHeight: "1.1",
  margin: "0 0 12px",
}

const details = {
  color: COLORS.muted,
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
}

const descriptionText = {
  color: COLORS.muted,
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "16px 0 0",
}

const rsvpBlock = {
  padding: "28px 0 8px",
}

const rsvpPrompt = {
  color: COLORS.muted,
  fontSize: "13px",
  margin: "0 0 12px",
  textAlign: "center" as const,
}

const buttonCell = {
  padding: "0 4px",
  width: "33.33%",
}

const buttonBase = {
  borderRadius: "999px",
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  padding: "12px 0",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "100%",
}

const primaryButton = {
  ...buttonBase,
  backgroundColor: COLORS.lime,
  color: COLORS.bg,
}

const secondaryButton = {
  ...buttonBase,
  backgroundColor: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.muted,
}

const oneClickNote = {
  color: COLORS.dim,
  fontSize: "11px",
  margin: "14px 0 0",
  textAlign: "center" as const,
}

const detailsLink = {
  color: COLORS.lime,
  fontSize: "13px",
  fontWeight: 700,
  textDecoration: "none",
}

const divider = {
  borderColor: COLORS.border,
  margin: "28px 0 16px",
}

const footer = {
  color: COLORS.dim,
  fontSize: "11px",
  lineHeight: "1.5",
  margin: 0,
  textAlign: "center" as const,
}
