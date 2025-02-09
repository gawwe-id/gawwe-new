// joy ui
import { Divider, FormLabel, Grid, Input, Stack } from "@mui/joy";

// project inport
import { signIn } from "@/lib/auth";
import ActionButton from "@/components/button/ActionButton";
import { Google } from "@mui/icons-material";

// ============================|| LOGIN ||============================ //

export default async function AuthLogin() {
  return (
    <>
      <Stack mb={4}>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <ActionButton
            fullWidth
            size="lg"
            type="submit"
            variant="soft"
            color="neutral"
            loadingText="Memproses..."
            startDecorator={<Google />}
          >
            Sign In dengan Google
          </ActionButton>
        </form>
      </Stack>

      <Stack mb={3}>
        <Divider>or</Divider>
      </Stack>

      <form
        action={async (formData) => {
          "use server";
          await signIn("resend", formData);
        }}
      >
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack spacing={1}>
              <FormLabel htmlFor="email">Email</FormLabel>
            </Stack>
            <Input
              id="email"
              name="email"
              type="email"
              size="lg"
              fullWidth
              sx={{ fontSize: 14 }}
            />
          </Grid>

          <Grid xs={12}>
            <ActionButton
              fullWidth
              size="lg"
              type="submit"
              variant="soft"
              color="primary"
              loadingText="Memproses..."
            >
              Sign In
            </ActionButton>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
