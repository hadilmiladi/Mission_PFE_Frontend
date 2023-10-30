/* import chat from './..';
import ecommerce from '@src/views/apps/ecommerce/store';
import email from '@src/views/apps/email/store';
import invoice from '@src/views/apps/invoice/store';
import kanban from '@src/views/apps/kanban/store';
import permissions from '@src/views/apps/roles-permissions/store';
import todo from '@src/views/apps/todo/store';
import users from '@src/views/apps/user/store';
import dataTables from '@src/views/tables/data-tables/store'; */

import auth from './authentication';
import layout from './layout';
// ** Reducers Imports
import navbar from './navbar';

const rootReducer = {
  auth,
  layout,
  navbar,
 /*  todo,
  chat,
  email,
  users,
  kanban,
  
  
  invoice,
  
  ecommerce,
  dataTables,
  permissions, */
};

export default rootReducer;
