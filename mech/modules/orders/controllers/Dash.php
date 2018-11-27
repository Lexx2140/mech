<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash extends Admin
{
    public function __construct()
    {
        parent::__construct();
    }

// ----------------------------------------------------------------------- DEFAULT METHOD
    public function index()
    {
        $this->list();
    }

// ------------------------------------------------------------------------ ORDERS LIST
    function list()
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset();

        // GET ORDERS (ALL/BY STATUS)
        $this->dash['elems'] = $this->Dash_model->get_orders();

        // RENDER TABLE
        $this->dash['list'] = $this->load->view('orders_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('orders');
    }

// ------------------------------------------------------------------------ VIEW ORDER
    public function view($id)
    {
        // GET ELEMENT DATA
        $elem = $this->Dash_model->get_order($id, true);

        // RENDER ELEMENT CREATE PAGE WITH DATA
        $this->dash['view'] = $this->load->view('order_view', $elem, true);

        // RENDER DASHBOARD
        $this->_render('dash/edit/view');
    }
}
