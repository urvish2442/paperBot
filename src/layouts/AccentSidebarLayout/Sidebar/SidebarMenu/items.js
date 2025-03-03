import AnalyticsTwoToneIcon from "@mui/icons-material/AnalyticsTwoTone";
import HealthAndSafetyTwoToneIcon from "@mui/icons-material/HealthAndSafetyTwoTone";
import AssignmentIndTwoToneIcon from "@mui/icons-material/AssignmentIndTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";
import VpnKeyTwoToneIcon from "@mui/icons-material/VpnKeyTwoTone";
import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";
import DesignServicesTwoToneIcon from "@mui/icons-material/DesignServicesTwoTone";
import SupportTwoToneIcon from "@mui/icons-material/SupportTwoTone";
import ReceiptTwoToneIcon from "@mui/icons-material/ReceiptTwoTone";
import BackupTableTwoToneIcon from "@mui/icons-material/BackupTableTwoTone";
import SmartToyTwoToneIcon from "@mui/icons-material/SmartToyTwoTone";
import { PATH_DASHBOARD } from "src/routes/paths";

const menuItems = [
    // {
    //     heading: "General",
    //     items: [
    //         {
    //             name: "Blueprints",
    //             icon: BackupTableTwoToneIcon,
    //             items: [
    //                 {
    //                     name: "Extended Sidebar",
    //                     link: "/dashboards/reports",
    //                     badge: "v3.0",
    //                     badgeTooltip: "Added in version 3.0"
    //                 },
    //                 {
    //                     name: "Accent Header",
    //                     link: "/blueprints/accent-header/dashboards/reports",
    //                     badge: "",
    //                     badgeTooltip: "Updated"
    //                 },
    //                 {
    //                     name: "Accent Sidebar",
    //                     link: "/blueprints/accent-sidebar/dashboards/reports"
    //                 },
    //                 {
    //                     name: "Boxed Sidebar",
    //                     link: "/blueprints/boxed-sidebar/dashboards/reports"
    //                 },
    //                 {
    //                     name: "Collapsed Sidebar",
    //                     link: "/blueprints/collapsed-sidebar/dashboards/reports"
    //                 },
    //                 {
    //                     name: "Bottom Navigation",
    //                     link: "/blueprints/bottom-navigation/dashboards/reports"
    //                 },
    //                 {
    //                     name: "Top Navigation",
    //                     link: "/blueprints/top-navigation/dashboards/reports"
    //                 }
    //             ]
    //         },
    //         {
    //             name: "Dashboards",
    //             icon: SmartToyTwoToneIcon,
    //             link: "/dashboards",
    //             items: [
    //                 {
    //                     name: "Reports",
    //                     link: "/dashboards/reports",
    //                     badge: "",
    //                     badgeTooltip: "Dot indicator with example tooltip"
    //                 },
    //                 {
    //                     name: "Expenses",
    //                     link: "/dashboards/expenses",
    //                     badge: ""
    //                 },
    //                 {
    //                     name: "Products",
    //                     link: "/dashboards/products"
    //                 },
    //                 {
    //                     name: "Statistics",
    //                     link: "/dashboards/statistics"
    //                 },
    //                 {
    //                     name: "Automation",
    //                     link: "/dashboards/automation"
    //                 },
    //                 {
    //                     name: "Analytics",
    //                     link: "/dashboards/analytics"
    //                 },
    //                 {
    //                     name: "Banking",
    //                     link: "/dashboards/banking"
    //                 },
    //                 {
    //                     name: "Commerce",
    //                     link: "/dashboards/commerce"
    //                 },
    //                 {
    //                     name: "Crypto",
    //                     link: "/dashboards/crypto"
    //                 },
    //                 {
    //                     name: "Finance",
    //                     link: "/dashboards/finance"
    //                 },
    //                 {
    //                     name: "Fitness",
    //                     link: "/dashboards/fitness"
    //                 },
    //                 {
    //                     name: "Healthcare",
    //                     link: "/dashboards/healthcare",
    //                     items: [
    //                         {
    //                             name: "Doctors",
    //                             link: "/dashboards/healthcare/doctor"
    //                         },
    //                         {
    //                             name: "Hospital",
    //                             link: "/dashboards/healthcare/hospital"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: "Helpdesk",
    //                     link: "/dashboards/helpdesk"
    //                 },
    //                 {
    //                     name: "Learning",
    //                     link: "/dashboards/learning"
    //                 },
    //                 {
    //                     name: "Monitoring",
    //                     link: "/dashboards/monitoring"
    //                 },
    //                 {
    //                     name: "Tasks",
    //                     link: "/dashboards/tasks"
    //                 }
    //             ]
    //         },
    //         {
    //             name: "Data Display",
    //             icon: HealthAndSafetyTwoToneIcon,
    //             badge: "",
    //             link: "/blocks",
    //             badgeTooltip: "Tokyo contains over 250 data display blocks",
    //             items: [
    //                 {
    //                     name: "Charts large",
    //                     link: "/blocks/charts-large"
    //                 },
    //                 {
    //                     name: "Charts small",
    //                     link: "/blocks/charts-small"
    //                 },
    //                 {
    //                     name: "Composed cards",
    //                     link: "/blocks/composed-cards"
    //                 },
    //                 {
    //                     name: "Grids",
    //                     link: "/blocks/grids"
    //                 },
    //                 {
    //                     name: "Icon cards",
    //                     link: "/blocks/icon-cards"
    //                 },
    //                 {
    //                     name: "Image cards",
    //                     link: "/blocks/image-cards"
    //                 },
    //                 {
    //                     name: "Lists large",
    //                     link: "/blocks/lists-large"
    //                 },
    //                 {
    //                     name: "Lists small",
    //                     link: "/blocks/lists-small"
    //                 },
    //                 {
    //                     name: "Navigation",
    //                     link: "/blocks/navigation"
    //                 },
    //                 {
    //                     name: "Profile cards",
    //                     link: "/blocks/profile-cards"
    //                 },
    //                 {
    //                     name: "Progress circular",
    //                     link: "/blocks/progress-circular"
    //                 },
    //                 {
    //                     name: "Progress horizontal",
    //                     link: "/blocks/progress-horizontal"
    //                 },
    //                 {
    //                     name: "Sparklines large",
    //                     link: "/blocks/sparklines-large"
    //                 },
    //                 {
    //                     name: "Sparklines small",
    //                     link: "/blocks/sparklines-small"
    //                 },
    //                 {
    //                     name: "Statistics",
    //                     link: "/blocks/statistics"
    //                 }
    //             ]
    //         },
    //         {
    //             name: "Applications",
    //             link: "/applications",
    //             icon: AnalyticsTwoToneIcon,
    //             items: [
    //                 {
    //                     name: "Calendar",
    //                     link: "/applications/calendar"
    //                 },
    //                 {
    //                     name: "File Manager",
    //                     link: "/applications/file-manager"
    //                 },
    //                 {
    //                     name: "Jobs Platform",
    //                     link: "/applications/jobs-platform"
    //                 },
    //                 {
    //                     name: "Mailbox",
    //                     link: "/applications/mailbox"
    //                 },
    //                 {
    //                     name: "Messenger",
    //                     link: "/applications/messenger"
    //                 },
    //                 {
    //                     name: "Projects Board",
    //                     link: "/applications/projects-board"
    //                 }
    //             ]
    //         }
    //     ]
    // },
    {
        heading: "Management",
        items: [
            {
                name: "Users",
                icon: AssignmentIndTwoToneIcon,
                link: PATH_DASHBOARD.users.root,
                items: [
                    {
                        name: "List",
                        link: PATH_DASHBOARD.users.root,
                    },
                    // {
                    //     name: "Add User",
                    //     link: PATH_DASHBOARD.users.add,
                    // },
                ],
            },
            {
                name: "Subjects",
                icon: StorefrontTwoToneIcon,
                link: PATH_DASHBOARD.subjects.root,
                items: [
                    // {
                    //     name: "Shop",
                    //     link: "/management/commerce/shop"
                    // },
                    {
                        name: "List",
                        link: PATH_DASHBOARD.subjects.root,
                    },
                    // {
                    //     name: "Details",
                    //     link: "/management/commerce/products/single/1"
                    // },
                    {
                        name: "Create Subject",
                        link: PATH_DASHBOARD.subjects.add,
                    },
                ],
            },
            {
                name: "Questions",
                icon: AssignmentIndTwoToneIcon,
                link: PATH_DASHBOARD.questions.root,
                items: [
                    {
                        name: "List",
                        link: PATH_DASHBOARD.questions.root,
                    },
                    {
                        name: "Create Question",
                        link: PATH_DASHBOARD.questions.add,
                    },
                ],
            },
            // {
            //     name: "Invoices",
            //     link: "/management/invoices",
            //     icon: ReceiptTwoToneIcon,
            //     items: [
            //         {
            //             name: "List",
            //             link: "/management/invoices"
            //         },
            //         {
            //             name: "Details",
            //             link: "/management/invoices/single/1"
            //         }
            //     ]
            // }
        ],
    },
    // {
    //     heading: "Extra Pages",
    //     items: [
    //         {
    //             name: "Auth Pages",
    //             icon: VpnKeyTwoToneIcon,
    //             items: [
    //                 {
    //                     name: "Login",
    //                     items: [
    //                         {
    //                             name: "Basic",
    //                             link: "/auth/login/basic?demo=true"
    //                         },
    //                         {
    //                             name: "Cover",
    //                             link: "/auth/login/cover?demo=true"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: "Register",
    //                     items: [
    //                         {
    //                             name: "Basic",
    //                             link: "/auth/register/basic?demo=true"
    //                         },
    //                         {
    //                             name: "Cover",
    //                             link: "/auth/register/cover?demo=true"
    //                         },
    //                         {
    //                             name: "Wizard",
    //                             link: "/auth/register/wizard?demo=true"
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: "Recover Password",
    //                     link: "/auth/recover-password?demo=true"
    //                 }
    //             ]
    //         },
    //         {
    //             name: "Status",
    //             icon: ErrorTwoToneIcon,
    //             items: [
    //                 {
    //                     name: "Error 404",
    //                     link: "/status/404"
    //                 },
    //                 {
    //                     name: "Error 500",
    //                     link: "/status/500"
    //                 },
    //                 {
    //                     name: "Maintenance",
    //                     link: "/status/maintenance"
    //                 },
    //                 {
    //                     name: "Coming Soon",
    //                     link: "/status/coming-soon"
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     heading: "Foundation",
    //     items: [
    //         {
    //             name: "Overview",
    //             link: "/",
    //             icon: DesignServicesTwoToneIcon
    //         },
    //         {
    //             name: "Documentation",
    //             icon: SupportTwoToneIcon,
    //             link: "/"
    //         }
    //     ]
    // }
];

export default menuItems;
