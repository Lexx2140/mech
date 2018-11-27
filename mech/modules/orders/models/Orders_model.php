<?php defined('BASEPATH') or exit('No direct script access allowed');

class Orders_model extends MY_Model
{
    protected $_table = 'orders';

    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------------ SAVE ORDER
    public function save_order($input, $callback = null)
    {
        unset($input['pagetitle'], $input['form']);

        // PREPARE DATE FOR FOLDER CREATION
        $date             = date_create();
        $y                = date_format($date, "Y");
        $folder           = date_format($date, "m-d_H-i-s");
        $input['created'] = date_format($date, "Y-m-d H:i:s");

        // SAVE TO DB
        if ($this->insert($input))
        {
            // UPLOAD FILES
            if ($_FILES['userfile']['error'][0] !== 4)
            {
            		// LOAD MECH & CI UPLOAD LIBRARies
            		$this->load->library(['upload', 'site/fileup_lib']);

                $conf['path']          = APPPATH . '../../assets/upload/orders/' . $y . '/' . $folder . '/';
                $conf['allowed_types'] = 'pdf|jpg|png|gif|bmp|txt|doc|docx|xls|xlsx';
                $conf['encrypt_name']  = true;

                $uploaded = $this->fileup_lib->multiup($conf);
            }

            // SEND NOTIFICATION TO EMAIL
            if ($callback)
            {
                $this->load->library('email');

                // Render html message
                $feedback['subject'] = 'Замовлення на прорахунок';
                $feedback['message'] = '<b>Від:</b> ' . $input['name'] . '<br>'
                    . '<b>Телефон:</b> ' . $input['tel'] . '<br><br>'
                    . '<b>E-mail:</b> ' . $input['email'] . '<br><br>'
                    . $input['message'];

                // LOAD EMAIL TEMPLATE
                $body = $this->load->view('email/xhtml.tpl', $feedback, true);

                // ATTACH FILES
                if (isset($uploaded) && !empty($uploaded))
                {
                    foreach ($uploaded as $file)
                    {
                        $realfile = $file['full_path'];

                        if (file_exists($realfile))
                        {
                            $this->email->attach($realfile);
                            $this->email->attachment_cid($realfile);
                        }
                    }
                }

                // PREPARE EMAIL PARAMS
                $this->email
                     ->from($input['email'], $input['name'])
                     ->reply_to($input['email'])
                     ->to($callback)
                     // ->bcc('')
                     ->subject($feedback['subject'])
                     ->message($body);

                // SEND EMAIL
                $this->email->send() or exit(lang('server_error'));
            }

            // SUCCESS MESAGE
            echo json_encode(['success' => lang('feedback_success')]);
        }
    }

}
