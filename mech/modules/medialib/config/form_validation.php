<?php defined('BASEPATH') or exit('No direct script access allowed');

$config = array(
    'medialib_val' => array(
        array(
            'field' => 'name',
            'label' => '"Назва"',
            'rules' => 'required|regex_match[/^[a-zA-Z0-9_-]*$/]|min_length[3]'
        )
    )
);
