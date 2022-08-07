import { createStyles, Group, Paper, SimpleGrid, Text } from '@mantine/core';
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
} from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  value: {
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1,
    marginTop: '-15px'
  },

  diff: {
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}));

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

interface StatsGridProps {
  data: { title: string; icon: keyof typeof icons; value: any; diff: number, type: number, usdPrice: any }[];
}

export function StatsGrid({ data }: StatsGridProps) {
  const { classes } = useStyles();
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;
    switch (stat.type) {
        case 1:
            return (
              <div key={"1"}>
                <Paper withBorder p="md" radius="md" key={stat.title}>
                  <Group position="apart">
                    <Text size="xs" color="dimmed" className={classes.title}>
                      {stat.title}
                    </Text>
                    <Icon className={classes.icon} size={22} stroke={1.5} />
                  </Group>
          
                  <Group align="flex-end" spacing="xs" mt={25}>
                    <Text className={classes.value}>{stat.value}</Text>
                    <Text
                      color='teal'
                      size="sm"
                      weight={500}
                      className={classes.diff}
                    >

                      <DiffIcon size={20} stroke={1.5} style={{marginLeft: "-10px"}}/>
                    </Text>
                  </Group>
                  <Text size="xs" color="dimmed" mt={7.5}>
                  {stat.value}
                  </Text>
                </Paper>
                </div>
                );
        case 2:
            return (
              <div key={"2"}>
                <Paper withBorder p="md" radius="md" key={stat.title}>
                  <Group position="apart">
                    <Text size="xs" color="dimmed" className={classes.title}>
                      {stat.title}
                    </Text>
                    <Icon className={classes.icon} size={22} stroke={1.5} />
                  </Group>
          
                  <Group align="flex-end" spacing="xs" mt={25}>
                    <Text className={classes.value}>{stat.value}</Text>
                    <Text
                      color={stat.diff > 0 ? 'teal' : 'red'}
                      size="sm"
                      weight={500}
                      className={classes.diff}
                    >
                      <DiffIcon size={20} stroke={1.5} style={{marginLeft: "-10px"}}/>
                    </Text>
                  </Group>
          
                  <Text size="xs" color="dimmed" mt={7.5}>
                    {stat.usdPrice === "Loading..." ? "Loading..." : "Approximately: $" + stat.usdPrice}
                  </Text>
                </Paper>
                </div>
              );
        default:
            return null;
    } 

  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
}