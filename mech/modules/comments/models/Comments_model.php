<?php defined('BASEPATH') or exit('No direct script access allowed');

class Comments_model extends MY_Model
{
    protected $_table = 'comments';

    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------------ GET ALL COMMENTS ON PAGE
    public function get_comments($url_id)
    {
        return $this->get(['url_id' => $url_id, 'status' => 2]);
    }

// ---------------------------------------------------------------------- RENDER COMMENTS TREE
    public function render_comments($array, $pid = '0', $parents = [])
    {
        // 1 - RETRIEVE ELEMS THAT HAS SUBS
        if ($pid === '0')
        {
            foreach ($array as $elem)
            {
                if (($elem['pid'] > '0') && !in_array($elem['pid'], $parents))
                {
                    $parents[] = $elem['pid'];
                }
            }
        }

        // 2 - RENDER HTML
        $ctree = '';

        foreach ($array as $comment)
        {
            if ($comment['pid'] === $pid)
            {
                $ctree .= '<li>';
                $ctree .= $this->load->view('comments/comment.tpl', $comment, true);

                if (in_array($comment['id'], $parents))
                {
                    $ctree .= '<ul>';
                    $ctree .= $this->render_comments($array, $comment['id'], $parents);
                    $ctree .= '</ul>';
                }

                $ctree .= '</li>';
            }
        }

        return $ctree;
    }

// ------------------------------------------------------------------------ SUBMIT COMMENT FORM
    public function submit()
    {
        // GET INPUT
        $input = $this->input->post();

        // ADD TIMESTAMP AND STATUS
        $input['created'] = date('Y-m-d H:i:s');
        $input['status']  = 1;

        // GET PAGETITLE
        $pagetitle = $input['pagetitle'];
        unset($input['pagetitle']);

        // LOAD VALIDATION LIBRARY & CHECK INPUT
        $this->load->library('form_validation');
        $this->form_validation->run() === true or exit(validation_errors());

        // CHECK FOR SPAM BOT
        $input['bcheck'] === 'false' or exit('Bot Attack');
        unset($input['bcheck']);

        // SAVE COMMENT TO DB
        $this->insert($input);

        // SEND NOTIFICATION TO EMAIL
        $conf = $this->config->load('app', true);
        $callback = $conf['callback_email'] ?? null;

        if ($callback)
        {
            $this->load->library('email');

            // RENDER HTML MESSAGE
            $feedback['subject'] = ($input['pid'] === '0')
                ? 'Новий коментар від користувача ' . $input['user_name'] . ' на сторінці "' . $pagetitle . '"'
                : 'Нова відповідь на коментар на сторінці "' . $pagetitle . '"';

            $feedback['message'] = '<b>Від:</b> ' . $input['user_name'] . '<br>'
                . '<b>E-mail:</b> ' . $input['user_email'] . '<br><br>'
                . $input['msg'];

            // LOAD EMAIL TEMPLATE
            $body = $this->load->view('email/xhtml.tpl', $feedback, true);

            // PREPARE EMAIL PARAMS
            $this->email
                 ->from($input['user_email'], $input['user_name'])
                 ->reply_to($input['user_email'])
                 ->to($callback)
                 // ->bcc('opavlyuk@gmail.com')
                 ->subject($feedback['subject'])
                 ->message($body);

            // SEND EMAIL
            $this->email->send() or exit(lang('server_error'));
        }

        // SUCCESS MESAGE
        echo json_encode(['success' => lang('comments_send')]);
    }

}
