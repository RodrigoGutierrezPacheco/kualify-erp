import { TopBar, ActionList, Icon, Frame, Text } from '@shopify/polaris';
import { ArrowDownMinor, QuestionMarkMajor } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

export default function Navbar() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSecondaryMenuOpen, setIsSecondaryMenuOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const toggleIsUserMenuOpen = useCallback(
        () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
        [],
    );

    const toggleIsSecondaryMenuOpen = useCallback(
        () => setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen),
        [],
    );

    const handleSearchResultsDismiss = useCallback(() => {
        setIsSearchActive(false);
        setSearchValue('');
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchValue(value);
        setIsSearchActive(value.length > 0);
    }, []);

    const handleNavigationToggle = useCallback(() => {
        console.log('toggle navigation visibility');
    }, []);
    const logo = {
        topBarSource:
            'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
        width: 86,
        url: '#',
        accessibilityLabel: 'Shopify',
    };

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={[
                {
                    items: [{ content: 'Back to Shopify', icon: ArrowDownMinor }],
                },
                {
                    items: [{ content: 'Community forums' }],
                },
            ]}
            name="Dharma"
            detail="Jaded Pixel"
            initials="D"
            open={isUserMenuOpen}
            onToggle={toggleIsUserMenuOpen}
        />
    );

    const searchResultsMarkup = (
        <ActionList
            items={[{ content: 'Shopify help center' }, { content: 'Community forums' }]}
        />
    );

    const searchFieldMarkup = (
        <TopBar.SearchField
            onChange={handleSearchChange}
            value={searchValue}
            placeholder="Search"
            showFocusBorder
        />
    );

    const secondaryMenuMarkup = (
        <TopBar.Menu
            activatorContent={
                <span>
                    <Icon source={QuestionMarkMajor} />
                    <Text as="span" visuallyHidden>
                        Secondary menu
                    </Text>
                </span>
            }
            open={isSecondaryMenuOpen}
            onOpen={toggleIsSecondaryMenuOpen}
            onClose={toggleIsSecondaryMenuOpen}
            actions={[
                {
                    items: [{ content: 'Community forums' }],
                },
            ]}
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            secondaryMenu={secondaryMenuMarkup}
            searchResultsVisible={isSearchActive}
            searchField={searchFieldMarkup}
            searchResults={searchResultsMarkup}
            onSearchResultsDismiss={handleSearchResultsDismiss}
            onNavigationToggle={handleNavigationToggle}
        />
    );

    return (
        <div style={{ height: '50px' }}>
            <Frame topBar={topBarMarkup} logo={logo} />
        </div>
    );
}