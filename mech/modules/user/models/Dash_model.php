<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash_model extends Admin_model
{
    protected $_table   = 'users_groups';
    protected $_table2  = 'users';

    protected $_select  = 'id, title, role, sort';
    protected $_select2 = 'id, sort, login, email';

    protected $_order   = 'sort ASC';
    protected $_order2  = 'sort ASC';

    protected $path = 'assets/img/users';

    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------------ GET
    public function get_groups()
    {
        return $this->get();
    }

    public function get_group($id = null)
    {
        return $this->get_row(['id' => $id ?? $this->session->pid]);
    }

    public function get_users($pid)
    {
        return $this->get_sec(['pid' => $pid]);
    }

    public function get_user($id)
    {
        $user = $this->db
                     ->select('users.*')
                     ->select('users_groups.role')
                     ->from('users', 1)
                     ->where('users.id', $id)
                     ->join('users_groups', 'users_groups.id=users.pid', 'left')
                     ->get()->row_array();
        return $user;
    }

    public function get_admins()
    {
        $admins = $this->db
                       ->select('users.*')
                       ->select('users_groups.*')
                       ->from('users')
                       ->where('users_groups.role', 'admin')
                       ->join('users_groups', 'users_groups.id=users.pid', 'left')
                       ->get()->result_array();
        return $admins;
    }

    public function get_admin_groups()
    {
        return $this->get(['role' => 'admin']);
    }

// ------------------------------------------------------------------------ CREATE GROUP
    public function create_group($default)
    {
        // SET DEFAULT SETTINGS
        $group['default'] = $default;

        // INPUT FORMS DATA
        $group['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('group_form', true);

        return $group;
    }

// ------------------------------------------------------------------------ CREATE ITEM
    public function create_user()
    {
        // GET PARENT GROUP
        $pid            = $this->session->pid;
        $user['parent'] = $this->get_row($pid);

        // INPUT FORMS DATA
        $user['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('user_form', true);

        return $user;
    }

// ------------------------------------------------------------------------ EDIT GROUP
    public function edit_group($id, $default)
    {
        $group = $this->get_group($id);

        // SET DEFAULT SETTINGS
        $group['default'] = $default;

        // INPUT FORMS DATA
        $group['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('group_form', true);

        return $group;
    }

// ------------------------------------------------------------------------ EDIT USER
    public function edit_user($id)
    {
        // GET PAGE DATA
        $user = $this->get_user($id);

        // INPUT FORMS DATA
        $user['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('user_form', true);

        return $user;
    }

// ------------------------------------------------------------------------ SAVE GROUP
    public function save_group($old, $new)
    {
        // CHECK LAST ADMIN GROUP
        if ($old['role'] === 'admin' && $new['role'] !== 'admin')
        {
            count($this->get_admins()) > 1 or exit('Ви не можете лишитись без адміністраторів!');
        }

        // SAVE NEW GROUP
        if (!isset($old['id']))
        {
            $new['sort'] = $this->new_order('group', $new);

            $this->insert($new);
        }

        // UPDATE GROUP
        else
        {
            $this->update($old['id'], $new);
        }
    }

// ------------------------------------------------------------------------ SAVE
    public function save_user($old, $new)
    {
        // CHECK IF USER LOGIN EXISTS
        copy_check($old['login'], $new['login'], $this->count_it_sec(['login' => $new['login']]));

        // CHECK IF USER EMAIL EXISTS
        copy_check($old['email'], $new['email'], $this->count_it_sec(['email' => $new['email']]));

        // CHECK PASSWORD
        $new['pass'] === $new['pass_check'] or exit('Введені паролі не співпадають');
        unset($new['pass_check']);

        if ($new['pass'] === '')
        {
            unset($new['pass']);
        }
        else
        {
            $new['pass'] = password_hash($new['pass'], PASSWORD_DEFAULT);
        }

        // SAVE NEW USER
        if (!isset($old['id']))
        {
            $new['pid']  = $this->session->pid;
            $new['sort'] = $this->new_order('user', $new);
            $this->insert_sec($new);
        }

        // UPDATE USER
        else
        {
            $this->update_sec($old['id'], $new);
        }
    }

// ------------------------------------------------------------------------ DELETE GROUP
    public function del_group($group)
    {
        if ($group['role'] === 'admin')
        {
            count($this->get_admin_groups()) > 1 or exit('Ви не можете лишитись без адміністраторів!');
        }

        // DELETE FROM DB
        $this->delete($group['id']);
    }

// ------------------------------------------------------------------------ DELETE USER
    public function del_user($user)
    {
        if ($user['role'] === 'admin')
        {
            count($this->get_admins()) > 1 or exit('Ви не можете лишитись без жодного адміністратора!');
        }

        // DELETE FROM DB
        $this->delete_sec($user['id']);
    }

// ------------------------------------------------------------------------ SORT MENUS
    public function sort_group($order)
    {
        $this->batch_up($order);
    }

// ------------------------------------------------------------------------ SORT ITEMS
    public function sort_user($order)
    {
        $this->batch_up_sec($order);
    }

// ----------------------------------------------------------------- SET ORDER FOR NEW ELEMENT
    public function new_order($type, $elem)
    {
        if ($type === 'group')
        {
            return intval($this->last('sort')) + 1;
        }

        if ($type === 'user')
        {
            return intval($this->last_sec('sort', ['pid' => $elem['pid']])) + 1;
        }
    }

// ------------------------------------------ REORDER SORTED LIST (after upper element delete)
    public function reorder($type, $elem)
    {
        if ($type === 'group')
        {
            $elems   = $this->get_groups();
            $reorder = $this->dash_lib->reorder_del($elem['sort'], $elems);
            empty($reorder) or $this->batch_up($reorder);
        }

        if ($type === 'user')
        {
            $elems   = $this->get_users($elem['pid']);
            $reorder = $this->dash_lib->reorder_del($elem['sort'], $elems);
            empty($reorder) or $this->batch_up_sec($reorder);
        }
    }

}
