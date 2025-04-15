import { Frame, Navigation } from '@shopify/polaris';
import { HomeMajor, OrderStatusMinor } from '@shopify/polaris-icons';
import { useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    return (
        <Frame>
            <Navigation location={location.pathname}>
                <Navigation.Section
                    items={[
                        {
                            url: '/inicio',
                            label: 'Inicio',
                            icon: HomeMajor,
                            matches: location.pathname === '/inicio'
                        },
                        {
                            url: '/usuarios',
                            label: 'Usuarios',
                            icon: OrderStatusMinor,
                            matches: location.pathname === '/usuarios'
                        },
                        {
                            url: '/profesionales',
                            label: 'Profesionales',
                            icon: OrderStatusMinor,
                            matches: location.pathname === '/profesionales'
                        },
                    ]}
                />
            </Navigation>
        </Frame>
    );
}