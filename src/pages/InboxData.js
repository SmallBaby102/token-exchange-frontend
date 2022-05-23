import User from "../images/avatar/a-sm.jpg";
import User1 from "../images/avatar/b-sm.jpg";
import User2 from "../images/avatar/c-sm.jpg";
import User3 from "../images/avatar/d-sm.jpg";

export const inboxList = [];

export const draftList = [
  {
    id: 1,
    meta: {
      time: "05:45 PM",
      subject: "Decline a job offer",
      message: "I have been facing trouble since yesterday to open my account",
      tags: ["Business"],
      checked: false,
    },
  },
  {
    id: 2,
    meta: {
      time: "07:45 PM",
      subject: "Grateful Reply",
      message: "Thank you for taking our time to mailing your issue, we will go though the problem",
      tags: ["Management"],
      checked: false,
    },
  },
  {
    id: 3,
    meta: {
      time: "10:10 PM",
      subject: "Approach a customer",
      message: "Is it possible to talk for a few minutes",
      tags: [""],
      checked: false,
    },
  },
  {
    id: 4,
    meta: {
      time: "01:32 AM",
      subject: "Decline a job offer",
      message: "I would like to decline an offer made",
      tags: ["Mail"],
      checked: false,
    },
  },
];

export const navData = [
  {
    name: "Deposit",
    icon: "inbox",
    badge: {
      text: function () {
        let defaultData = inboxList.filter((item) => item.message.meta.inbox === true);
        return defaultData.length;
      },
      theme: "primary",
    },
  },
  {
    name: "Withdraw",
    icon: "edit",
    badge: {
      text: function () {
        let defaultData = inboxList.filter((item) => item.message.meta.draft === true);
        return defaultData.length;
      },
      theme: "light",
    },
  },
  {
    name: "Exchange",
    icon: "star",
  },
  {
    name: "Load",
    icon: "send",
  },
  {
    name: "Missions Missed",
    icon: "archive",
  },
  {
    name: "Weekly Challenge",
    icon: "alert",
  },
];

export const inboxLabels = [
  {
    id: 1,
    text: "My Guild:#Team",
    color: "primary",
  },
  {
    id: 2,
    text: "Join a Guild",
    color: "danger",
  },
  {
    id: 3,
    text: "Messages",
    color: "info",
  },
];

export const colourOptions = [
  { value: "primary", label: "Primary" },
  { value: "success", label: "Success" },
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "danger", label: "Danger" },
  { value: "secondary", label: "Secondary" },
];

export const contacts = [
  {
    id: 1,
    name: "Abu Bin Ishtiyak",
    img: User,
    theme: "primary",
    designation: "CEO of Softnio",
    mail: "info@softnio.com",
  },
  {
    id: 2,
    name: "Dora Schmidt",
    img: User1,
    theme: "primary",
    designation: "VP Product Imagelab",
    mail: "dora@softnio.com",
  },
  {
    id: 3,
    name: "Jessica Fowler",
    img: User2,
    theme: "primary",
    designation: "Developer at Softnio",
    mail: "jess@softnio.com",
  },
  {
    id: 4,
    name: "Eula Flowers",
    img: User3,
    theme: "primary",
    designation: "Co-Founder of Vitzo",
    mail: "flowers@vitzo.com",
  },
  {
    id: 5,
    name: "Ricardo Salazar",
    img: User1,
    theme: "primary",
    designation: "",
    mail: "salazar@softnio.com",
  },
  {
    id: 6,
    name: "Larry Hughes",
    theme: "primary",
    designation: "",
    mail: "larry@softnio.com",
  },
  {
    id: 7,
    name: "Laura Mathews",
    theme: "primary",
    img: User3,
    designation: "",
    mail: "mathews@softnio.com",
  },
  {
    id: 8,
    name: "Mildred Delgado",
    theme: "blue",
    img: User2,
    designation: "",
    mail: "mildred@softnio.com",
  },
];

export const formTemplates = [
  {
    id: 0,
    text: "Thank you message",
  },
  {
    id: 1,
    text: "Your issues solved",
  },
  {
    id: 2,
    text: "Welcome message",
  },
];
