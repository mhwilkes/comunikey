import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

export const mainListItems = (
    <div>
        <ListItemLink href="/profile">
            <ListItemIcon>
                <DashboardIcon/>
            </ListItemIcon>
            <ListItemText primary="Profile"/>
        </ListItemLink>
        <ListItem button>
            <ListItemIcon>
                <ShoppingCartIcon/>
            </ListItemIcon>
            <ListItemText primary="Orders"/>
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Customers"/>
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <BarChartIcon/>
            </ListItemIcon>
            <ListItemText primary="Reports"/>
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <LayersIcon/>
            </ListItemIcon>
            <ListItemText primary="Integrations"/>
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Categories</ListSubheader>
        <ListItem button>
            <ListItemIcon>
                <FreeBreakfastIcon/>
            </ListItemIcon>
            <ListItemText primary="Key Caps"/>
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <FreeBreakfastIcon/>
            </ListItemIcon>
            <ListItemText primary="Keyboards"/>
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <FreeBreakfastIcon/>
            </ListItemIcon>
            <ListItemText primary="Switches"/>
        </ListItem>
    </div>
);
