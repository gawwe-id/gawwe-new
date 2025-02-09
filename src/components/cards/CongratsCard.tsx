import AspectRatio from "@mui/joy/AspectRatio"
import Button from "@mui/joy/Button"
import Card from "@mui/joy/Card"
import CardActions from "@mui/joy/CardActions"
import CardContent from "@mui/joy/CardContent"
import CardOverflow from "@mui/joy/CardOverflow"
import Typography from "@mui/joy/Typography"

// assets
import { CheckCircleOutlineRounded } from "@mui/icons-material"

interface CongratsCardProps {
  title: string
  description: string
  titleBtn?: string
  onActionBtn?: () => void
}

export default function CongratsCard({
  title,
  description,
  titleBtn,
  onActionBtn,
}: CongratsCardProps) {
  return (
    <Card
      sx={{
        textAlign: "center",
        alignItems: "center",
        width: "100%",
        overflow: "auto",
        "--icon-size": "100px",
      }}
    >
      <CardOverflow variant="soft">
        <AspectRatio
          variant="outlined"
          color="success"
          ratio="1"
          sx={{
            m: "auto",
            transform: "translateY(50%)",
            borderRadius: "50%",
            width: "var(--icon-size)",
            boxShadow: "sm",
            bgcolor: "background.surface",
            position: "relative",
          }}
        >
          <div>
            <CheckCircleOutlineRounded
              sx={{ fontSize: "4rem", color: "salmon" }}
            />
          </div>
        </AspectRatio>
      </CardOverflow>
      <Typography level="title-lg" sx={{ mt: "calc(var(--icon-size) / 2)" }}>
        {title}
      </Typography>
      <CardContent sx={{ maxWidth: "40ch" }}>{description}</CardContent>
      {titleBtn && (
        <CardActions
          orientation="vertical"
          buttonFlex={1}
          sx={{
            "--Button-radius": "40px",
            width: "clamp(min(100%, 160px), 50%, min(100%, 200px))",
          }}
        >
          <Button variant="solid" color="primary" onClick={onActionBtn}>
            {titleBtn}
          </Button>
        </CardActions>
      )}
    </Card>
  )
}
