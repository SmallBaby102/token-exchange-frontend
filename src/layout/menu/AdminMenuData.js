const adminmenu = [
  {
    text: "Home",
    link: "/",
  },
  {
    text: "Users",
    link: "/users",
  },
  {
    text: "Missions",
    link: "/missions",
  },
  {
    text: "Leaderboard & Rewards",
    subMenu: [
      {
        text: "Leaderboard",
        link: "/leaderboard",
      },
      {
        text: "oldind",
        link: "/leaderboard-oldind",
      },
      {
        text: "Welcome",
        link: "leaderboard-welcome",
      },
    ],
  },
  {
    text: "Withdraw",
    link: "/withdraw",
  },
  {
    text: "Support",
    link: "/support",
  },
];
export default adminmenu;
