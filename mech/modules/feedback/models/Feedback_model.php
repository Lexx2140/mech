<?php defined('BASEPATH') or exit('No direct script access allowed');

class Feedback_model extends MY_Model
{
    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------------ SUBMIT FORM
    public function submit()
    {
        $input = $this->input->post();

        // SEND NOTIFICATION TO EMAIL
        $conf     = $this->load->config('app', true);
        $callback = $conf['callback_email'] ?? null;

        // LOAD VALIDATION LIBRARY & CHECK INPUTs
        $this->load->library('form_validation');
        $this->form_validation->run($input['form']) or exit(validation_errors());

        // CHECK FOR SPAM BOT
        (!isset($input['bot'])) or exit('Bot Attack');

        if ($input['form'] === 'simple')
        {
            $this->simple_form($input, $callback);
        }
        if ($input['form'] === 'order')
        {
            $this->load->model('orders/Orders_model');
            $this->Orders_model->save_order($input, $callback);
        }
    }

// ------------------------------------------------------------------------ SEND SIMPLE FORM
    public function simple_form($input, $callback = null)
    {
        if ($callback)
        {
            $this->load->library('email');

            // Render html message
            $feedback['subject'] = 'Запит зі сторінки ' . $input['pagetitle'];
            $feedback['message'] = '<b>Від:</b> ' . $input['name'] . '<br>'
                . '<b>Телефон:</b> ' . $input['tel'] . '<br><br>'
                . '<b>E-mail:</b> ' . $input['email'] . '<br><br>'
                . $input['message'];

            // LOAD EMAIL TEMPLATE
            $body = $this->load->view('email/xhtml.tpl', $feedback, true);

            // PREPARE EMAIL PARAMS
            $this->email
                 ->from($input['email'], $input['name'])
                 ->reply_to($input['email'])
                 ->to($callback)
                 // ->bcc('opavlyuk@gmail.com')
                 ->subject($feedback['subject'])
                 ->message($body);

            // SEND EMAIL
            $this->email->send() or exit(lang('server_error'));

            // SUCCESS MESAGE
            echo json_encode(['success' => lang('feedback_success')]);
        }
        else
        {
            echo 'Неможливо надіслати повідомлення';
        }
    }
}
