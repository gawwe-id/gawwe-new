import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/joy";

export default async function CardTransactions() {
  // Transaction data
  const transactions = [
    {
      id: 1,
      name: "Robert Carter",
      avatar: "/api/placeholder/32/32",
      status: "Pending",
      date: "June 14, 2023",
      amount: "+ $2438.71",
    },
    {
      id: 2,
      name: "Daniel Foster",
      avatar: "/api/placeholder/32/32",
      status: "Done",
      date: "June 12, 2023",
      amount: "- $525.47",
    },
  ];
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography level="h4">Transactions</Typography>
          <Button variant="plain">All Data</Button>
        </Stack>

        <Box sx={{ overflowX: "auto" }}>
          {/* Transaction Headers */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              px: 2,
              py: 1,
              bgcolor: "background.level1",
              borderRadius: "sm",
              mb: 2,
              minWidth: 600, // Minimum width before horizontal scroll
            }}
          >
            <Typography level="body-sm" sx={{ flex: 2 }}>
              Name
            </Typography>
            <Typography level="body-sm" sx={{ flex: 1 }}>
              Status
            </Typography>
            <Typography level="body-sm" sx={{ flex: 1 }}>
              Date
            </Typography>
            <Typography level="body-sm" sx={{ flex: 1, textAlign: "right" }}>
              Amount
            </Typography>
          </Stack>

          {/* Transaction List */}
          <Stack spacing={2}>
            {transactions.map((transaction) => (
              <Stack
                key={transaction.id}
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ px: 2 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ flex: 2 }}
                >
                  <Avatar src={transaction.avatar} size="sm" />
                  <Typography>{transaction.name}</Typography>
                </Stack>
                <Box sx={{ flex: 1 }}>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={
                      transaction.status === "Pending" ? "warning" : "success"
                    }
                  >
                    {transaction.status}
                  </Chip>
                </Box>
                <Typography level="body-sm" sx={{ flex: 1 }}>
                  {transaction.date}
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    flex: 1,
                    textAlign: "right",
                    color: transaction.amount.includes("+")
                      ? "success.500"
                      : "danger.500",
                  }}
                >
                  {transaction.amount}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
