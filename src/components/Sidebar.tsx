import { Frame, Navigation } from '@shopify/polaris';
import { HomeMajor, OrderStatusMinor, ProductCostMajor } from '@shopify/polaris-icons';

export default function Sidebar() {
    return (
        <Frame>
            <Navigation location="/">
                <Navigation.Section
                    items={[
                        {
                            url: '#',
                            label: 'Home',
                            icon: HomeMajor,
                        },
                        {
                            url: '#',
                            excludePaths: ['#'],
                            label: 'Orders',
                            icon: OrderStatusMinor,
                            badge: '15',
                        },
                        {
                            url: '#',
                            excludePaths: ['#'],
                            label: 'Products',
                            icon: ProductCostMajor,
                        },
                    ]}
                />
            </Navigation>
        </Frame>
    );
}