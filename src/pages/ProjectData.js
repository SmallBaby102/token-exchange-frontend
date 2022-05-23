import TeamImg2 from "../images/avatar/c-sm.jpg";
import TeamImg3 from "../images/avatar/a-sm.jpg";

import { setDeadline } from "../utils/Utils";

export const projectData = [
  {
    id: 1,
    avatarClass: "purple",
    title: "BTC",
    subtitle: "H-00000",
    lead: "Abu Bin",
    tasks: "25",
    plus: "1",
    checked: false,
    deadline: setDeadline(20),
    team: [
      {
        value: "Abu Bin",
        label: "Abu Bin",
        image: null,
        theme: "purple",
      },
      { value: "Milagros Betts", label: "Milagros Betts", theme: "pink" },
      { value: "Ryu Duke", label: "Ryu Duke", theme: "orange" },
    ],
  },
  {
    id: 2,
    avatarClass: "warning",
    title: "ETH",
    subtitle: "I-00000",
    tasks: "61",
    plus: '3',
    lead: "Newman John",
    checked: false,
    deadline: setDeadline(5), // Format ** mm/dd/yyyy
    team: [
      {
        value: "Abu Bin",
        label: "Abu Bin",
        // image: TeamImg2,
        theme: "purple",
      },
      {
        value: "Newman John",
        label: "Newman John",
        image: null,
        theme: "primary",
      },
    ],
  },
  {
    id: 3,
    avatarClass: "info",
    title: "USD",
    subtitle: "M-00000",
    tasks: "0",
    plus: '0',
    totalTask: "15",
    lead: "Abu Bin",
    checked: false,
    deadline: setDeadline(1), // Format ** mm/dd/yyyy
    team: [
      {
        value: "Abu Bin",
        label: "Abu Bin",
        // image: TeamImg3,
        theme: "purple",
      },
    ],
  },
];

export const teamList = [
  { value: "Abu Bin", label: "Abu Bin", theme: "purple" },
  { value: "Newman John", label: "Newman John", theme: "primary" },
  { value: "Milagros Betts", label: "Milagros Betts", theme: "purple" },
  { value: "Joshua Wilson", label: "Joshua Wilson", theme: "pink" },
  { value: "Ryu Duke", label: "Ryu Duke", theme: "orange" },
  { value: "Aliah Pitts", label: "Aliah Pitts", theme: "blue" },
];
