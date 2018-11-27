<?php defined('BASEPATH') or exit('No direct script access allowed');

class MY_Model extends CI_Model
{
    protected $_table;
    protected $_table2;
    protected $_select;
    protected $_select2;
    protected $_order;
    protected $_order2;
    protected $_key = 'id';
    protected $_key2;

    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------------ GET

//=== GET ARRAY FROM TABLE
    public function get($id = null, $sel = null, $order = null, $num = null, $offset = null, $sec = null)
    {
        $this->where_tr($id);
        $this->select_tr($sel ?? $this->_select);
        $this->order_tr($order ?? $this->_order);
        return $this->db->get($sec ?? $this->_table, $num, $offset)->result_array();
    }

//=== GET ARRAY FROM TABLE2
    public function get_sec($id = null, $sel = null, $order = null, $num = null, $offset = null)
    {
        return $this->get(
            $id, ($sel ?? $this->_select2), ($order ?? $this->_order2), $num, $offset, $this->_table2
        );
    }

//=== GET ONE ROW FROM TABLE
    public function get_row($id = null, $sel = null, $sec = null)
    {
        $this->where_tr($id);
        $this->select_tr($sel);
        return $this->db->get($sec ?? $this->_table, 1)->row_array();
    }

//=== GET ONE ROW FROM TABLE2
    public function get_row_sec($id = null, $sel = null)
    {
        return $this->get_row($id, $sel, $this->_table2);
    }

//=== INSERT
    public function insert($data, $sec = null)
    {
        $this->db->insert($sec ?? $this->_table, $data);
        return $this->db->insert_id();
    }

//=== INSERT TO TABLE2
    public function insert_sec($data)
    {
        return $this->insert($data, $this->_table2);
    }

//=== BATCH INSERT TO TABLE
    public function insert_batch($data, $sec = null)
    {
        $this->db->insert_batch($sec ?? $this->_table, $data);
        return $this->db->insert_id();
    }

//=== BATCH INSERT TO TABLE2
    public function insert_batch_sec($data)
    {
        return $this->insert_batch($data, $this->_table2);
    }

//=== UPDATE
    public function update($id, $data, $sec = null)
    {
        $this->safe_where_tr($id);
        $this->db->update($sec ?? $this->_table, $data);
        return $this->db->affected_rows();
    }

//=== UPDATE TABLE2
    public function update_sec($id, $data)
    {
        return $this->update($id, $data, $this->_table2);
    }

//=== BATCH UPDATE TABLE
    public function batch_up($data, $sec = null)
    {
        $this->db->update_batch($sec ?? $this->_table, $data, $this->_key);
        return $this->db->affected_rows();
    }

//=== BATCH UPDATE TABLE2
    public function batch_up_sec($data)
    {
        return $this->batch_up($data, $this->_table2);
    }

// ------------------------------------------------------------------------ DELETE

//=== DELETE FROM TABLE
    public function delete($id, $sec = null)
    {
        $this->safe_where_tr($id);
        $this->db->limit(1);
        $this->db->delete($sec ?? $this->_table);
        return $this->db->affected_rows();
    }

//=== DELETE FROM TABLE2
    public function delete_sec($id)
    {
        return $this->delete($id, $this->_table2);
    }

// ------------------------------------------------------------------------ TOOLS

//=== GET LAST ITEM ID (or custom value (cell))
    public function last($cell = null, $where = null, $sec = null)
    {
        $cell = $cell ?? $this->_key;

        $this->db->select_max($cell);
        $this->where_tr($where);

        $row = $this->db->get($sec ?? $this->_table, 1)->row_array();
        return $row[$cell];
    }

//=== GET LAST ITEM ID (or custom value (cell)) IN TABLE2
    public function last_sec($cell = null, $where = null)
    {
        return $this->last($cell, $where, $this->_table2);
    }

//=== COUNT ITEMS IN TABLE
    public function count_it($id = null, $sec = null)
    {
        $this->where_tr($id);
        return $this->db->from($sec ?? $this->_table)->count_all_results();
    }

//=== COUNT ITEMS IN TABLE2
    public function count_it_sec($id = '', $table = null)
    {
        return $this->count_it($id, $table ?? $this->_table2);
    }

//=== SET ONE VALUE
    public function set_update($id, $item, $value, $escape = true, $sec = null)
    {
        $this->safe_where_tr($id);
        return $this->db->set($item, $value, $escape)->update($sec ?? $this->_table);
    }

//=== SET ONE VALUE IN TABLE2
    public function set_update_sec($id, $item, $value, $escape = true)
    {
        return $this->set_update($id, $item, $value, $escape, $this->_table2);
    }

//=== CHANGE PUBLIC STATE ('1|0')
    public function pub($id = '', $sel = 'pub', $sec = null)
    {
        $row = (!isset($sec)) ? $this->get_row($id, $sel) : $this->get_row_sec($id, $sel);

        return $this->db
                    ->where($this->_key, $id)
                    ->set($sel, ($row[$sel]) ? 0 : 1)
                    ->update($sec ?? $this->_table);
    }

//=== CHANGE PUBLIC STATE IN TABLE2 ('1|0')
    public function pub_sec($id = '', $sel = 'pub')
    {
        return $this->pub($id, $sel, $this->_table2);
    }

// ------------------------------------------------------------------------ TRIGGERS

//--- WHERE TRIGGER (id or where())
    public function where_tr($id)
    {
        if (is_numeric($id))
        {
            $this->db->where($this->_key, $id);
        }
        elseif (is_array($id))
        {
            foreach ($id as $_key => $_value)
            {
                $this->db->where($_key, $_value);
            }
        }
    }

//--- SAFE WHERE TRIGGER (for delete, update etc)
    public function safe_where_tr($id)
    {
        if (isset($id))
        {
            $this->where_tr($id);
        }
        else
        {
            exit('Nothing selected!');
        }
    }

//--- SELECT TRIGGER
    public function select_tr($sel = null)
    {
        if (is_string($sel))
        {
            $this->db->select($sel);
        }
    }

//--- ORDER BY TRIGGER
    public function order_tr($order = null)
    {
        if (is_string($order))
        {
            $this->db->order_by($order);
        }

        if (is_array($order))
        {
            foreach ($order as $_key => $_value)
            {
                $this->db->order_by($_key, $_value);
            }
        }
    }
}
