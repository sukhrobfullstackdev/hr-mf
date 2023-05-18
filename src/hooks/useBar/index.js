import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {
    IconFillBookmark,
    IconFillCalendar,
    IconFillDotList,
    IconFillGrid,
    IconFillInvoice,
    IconFillLayers, IconFillSettings,
    IconFillUsers, IconSettings
} from "../../components/Icon";

const bar = [
    {
        path: '/dashboard/main',
        title: 'Statistika',
        role: ['HR', 'HHR', 'HO'],
        icon: <IconFillGrid />
    },
    {
        path: '/dashboard/catalog',
        title: 'Katalog',
        role: ['SA'],
        icon: <IconFillLayers />,
        children: [
            {
                path: 'organ',
                title: 'Tashkilotlar',
                role: ['SA'],
            },
            {
                path: 'register',
                title: 'Foydalanuvchilar',
                role: ['SA'],
            },
            {
                path: 'employee',
                title: 'Hodimlar',
                role: ['SA'],
            },
        ]
    },
    {
        path: '/dashboard/iq-test',
        title: "Test sinovi",
        role: ['SA'],
        icon: <IconFillDotList />
    },
    {
        path: '/dashboard/salary',
        title: 'Eng kam ish haqqi',
        role: ['SA'],
        icon: <IconFillBookmark />
    },
    {
        path: '/dashboard/manual',
        title: 'Xujjatlar',
        role: ['HR', 'HHR', 'HO'],
        icon: <IconFillInvoice />,
        children: [
            {
                path: 'appeal',
                title: 'Arizalar',
                role: ['HR', 'HHR', 'HO'],
            }, {
                path: 'vacations',
                title: 'Tatillar',
                role: ['HR', 'HHR'],
            },
            // {
            //     path: 'contracts',
            //     title: 'Mexnat shartnomalari',
            //     role: ['HR', 'HHR', 'HO'],
            // },
            {
                path: 'orders',
                title: 'Buyruqlar',
                role: ['HR', 'HHR', "HO"],
            }, {
                path: 'identification',
                title: 'Guvoxnomalar',
                role: ['HR', 'HHR'],
            }, {
                path: 'surveys',
                title: "So'rovnomalar",
                role: ['HR', 'HHR']
            }, {
                path: 'dismiss-sheet',
                title: "Ishdan bo'shash varaqasi",
                role: ['HR', 'HHR', 'HO']
            }, {
                path: 'business-trip-plan',
                title: "Xizmat safar rejasi",
                role: ['HR', 'HHR', 'HO']
            }, {
                path: 'notice',
                title: "Bildirgilar",
                role: ['HO']
            }
        ]
    },
    {
        path: '/dashboard/structure-view',
        title: 'Struktura',
        role: ['HR', 'HHR'],
        icon: <IconFillDotList />,
        children: [
            {
                path: 'sections',
                title: `Bo'limlar`,
                role: ['HR', 'HHR'],
            },
            {
                path: 'positions',
                title: 'Lavozimlar',
                role: ['HR', 'HHR'],
            },
            {
                path: 'child-organs',
                title: 'Quyi tashkilotlar',
                role: ['HR', 'HHR'],
            },
            {
                path: 'structure-view',
                title: 'Struktura',
                role: ['HR', 'HHR'],
            },
            {
                path: 'report',
                title: 'Shtat jadvali',
                role: ['HR', 'HHR'],
            }
        ]
    },
    {
        path: '/dashboard/staff',
        title: 'Hodimlar',
        role: ['HR','HHR'],
        children: [
            {
                path: 'staff',
                title: 'Hodimlar',
                role: ['HR','HHR'],
            },
            {
                path: 'staff/reserve',
                title: 'Talabalar',
                role: ['HR','HHR'],
            },
            {
                path: 'staff/check',
                title: 'Tekshiruvi',
                role: ['HR','HHR'],
            }
        ],
        icon: <IconFillUsers/>
    },
    {
        path: '/dashboard/state-table',
        title: 'Tabel',
        role: ['HR', 'HHR', "HO"],
        children: [
            {
                path: 'state-table',
                title: 'Tabel jadvali',
                role: ['HR', 'HHR', 'HO']
            }, {
                path: 'all-table',
                title: 'Tabellar',
                role: ['HR', 'HHR', 'HO']
            }, {
                path: 'time-table',
                title: 'Vaqtlar jadvali',
                role: ['HR', 'HHR']
            }, {
                path: 'turnstile',
                title: 'Turniket nazorati',
                role: ['HR', 'HHR', 'HO']
            }],
        icon: <IconFillCalendar />
    },
    {
        path: '/dashboard/shtat-departments',
        title: 'Shtat',
        role: ['HR', 'HHR', "HO"],
        children: [
            {
                path: 'shtat-departments',
                title: 'Bo\'limlar',
                role: ['HR', 'HHR', 'HO']
            }
        ],
        icon: <IconFillCalendar />
    },
    {
        path: '/dashboard/settings',
        role: ['HR'],
        title: 'Sozlama',
        icon: <IconFillSettings/>,
        children: [
            {
                path: 'dey-off',
                title: 'Bayram kunlari',
                role: ['HR']
            },
            {
                path: `role-control`,
                title: `Ro'l taqsimoti`,
                role: ['HR']
            },
            {
                path: `order-types`,
                title: `Buyruq turlari`,
                role: ['HR']
            }
        ]
    }
];

function useBar(props) {
    const [activeBar, setBar] = useState([]);
    const isUser = useSelector(state => state?.isUser);
    useEffect(() => {
        if (isUser && Object.keys(isUser).length && 'role' in isUser) {
            const a = bar.filter(v => v.role.indexOf(isUser.current_role) > -1);
            setBar(a);
        }
    }, [isUser])
    return activeBar;
}
export default useBar;