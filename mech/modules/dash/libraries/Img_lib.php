<?php defined('BASEPATH') or exit('No direct script access allowed');

class Img_lib
{
    public function __construct()
    {
        $this->CI = &get_instance();
    }

// ---------------------------------------------------- IMAGE & IMAGE INPUT EDIT
    public function img_control($old, $item, $img_cell, $path, $filename, $overwrite = false)
    {
        // DELETE IMAGE(s)
        $item = (isset($item['file_del']))
            ? $this->img_delete($old, $item, $img_cell, $path)
            : $item;

        // UPLOAD IMAGE & GET FULL INFO AND MAKEUP IT (optional)
        if (is_uploaded_file($_FILES['userfile']['tmp_name']))
        {
            // UPLOAD IMAGE
            $img = $this->CI->up_lib->upload_img($path, $filename, $overwrite);

            // SET IMAGE CELL
            $item[$img_cell] = $img['file_name'];

            // CREATE IMAGE & THUMB (only for bitmaps)
            if ($img['is_image'] && $this->makeup($img, $item, $img_cell))
            {
                $item['thumb'] = $img['raw_name'] . '-thumb' . $img['file_ext'];
            }
        }

        // Clear img service inputs & return full item
        return $this->clean_input($item);
    }

// --------------------------------------- IMAGE MAKEUP (crop, resize, (watermark, rotate))
    public function makeup($img, $input, $img_cell = null)
    {
    		$img_cell = $img_cell ?? 'media';

        // BACKUP ORIGINAL IMAGE
        $src = $img['file_path'] . $img['raw_name'] . '-orig' . $img['file_ext'];
        copy($img['full_path'], $src);

        /**
         * IMAGE MAKEUP
         */
        // GET CROP DIMENSIONS (if isset)
        $crop = $this->crop_check($img_cell, $input);

        // GET IMAGE SIZE
        $size = $this->get_size('img', $img, $input);

        // SET RESULT IMAGE
        $res = $img['full_path'];

        // CROP & RESIZE
        $this->crop_resize($src, $res, $img, $crop, $size);

        /**
         * THUMB MAKEUP
         */
        // GET THUMB
        $res = $img['file_path'] . $img['raw_name'] . '-thumb' . $img['file_ext'];

        // GET CROP
        $crop = $this->crop_check('thumb', $input);

        // GET IMAGE SIZE
        $size = $this->get_size('thumb', $img, $input);

        // BEGIN MAGIC...
        $this->crop_resize($src, $res, $img, $crop, $size);

        return true;
    }

// ------------------------------------------------------------------ IMAGE RESIZE & CROP
    public function crop_resize($src, $res, $img, $crop, $size)
    {
        // LOAD CI IMAGE LIBRARY
        $this->CI->load->library('image_lib');

        // SET CONFIG
        $config['source_image'] = $src;
        $config['new_image']    = $res;
        // $config['quality']      = 90;

        // MANUAL MAKEUP
        if (is_array($crop))
        {
            // MANUAL IMAGE CROP
            $config['maintain_ratio'] = false;
            $config['width']          = $crop['w'];
            $config['height']         = $crop['h'];
            $config['x_axis']         = $crop['x'];
            $config['y_axis']         = $crop['y'];

            $this->CI->image_lib->initialize($config);
            $this->CI->image_lib->crop() or exit($this->CI->image_lib->display_errors());

            // MANUAL IMAGE RESIZE
            $config['source_image']   = $res;
            $config['maintain_ratio'] = true;
            $config['width']          = $size['width'];
            $config['height']         = $size['height'];

            $this->CI->image_lib->initialize($config);
            return $this->CI->image_lib->resize() or exit($this->CI->image_lib->display_errors());
        }

        // AUTO MAKEUP
        else
        {
            // AUTO RESIZE IMAGE
            $config['maintain_ratio'] = true;
            $config['width']          = $size['width'];
            $config['height']         = $size['height'];
            $config['master_dim']     = $this->dim($img, $size['width'], $size['height']);

            $this->CI->image_lib->initialize($config);
            $this->CI->image_lib->resize() or exit($this->CI->image_lib->display_errors());

            // GET RESIZED IMAGE SIZE
            list($resized_w, $resized_h) = getimagesize($res);

            // AUTO CROP IMAGE
            $config['source_image']   = $res;
            $config['maintain_ratio'] = false;
            $config['x_axis']         = ($resized_w - $config['width']) / 2;
            $config['y_axis']         = ($resized_h - $config['height']) / 2;

            $this->CI->image_lib->initialize($config);
            return $this->CI->image_lib->crop() or exit($this->CI->image_lib->display_errors());
        }
    }

// ----------------------------------------------------- CHECK IF IMAGE WAS MANUALLY CROPPED
    public function crop_check($src, $input)
    {
        $crop = [
            'w' => $input[$src . '_cw'] ?? null,
            'h' => $input[$src . '_ch'] ?? null,
            'x' => $input[$src . '_cx'] ?? null,
            'y' => $input[$src . '_cy'] ?? null
        ];
        return (array_sum($crop) > 0) ? $crop : null;
    }

// ----------------------------------------------------------- GET IMAGE/THUMB SIZE
    public function get_size($src, $img, $input)
    {
        return $size = [
            'width'  => (!empty($input[$src . '_w'])) ? $input[$src . '_w'] : $img['image_width'],
            'height' => (!empty($input[$src . '_h'])) ? $input[$src . '_h'] : $img['image_height']
        ];
    }

// ---------------------------------------- GET MASTER DIM (by shorter side, autoresize & crop)
    public function dim($img, $width, $height)
    {
        $dim = (intval($img['image_width']) / intval($img['image_height'])) - ($width / $height);
        return ($dim > 0) ? 'height' : 'width';
    }

// --------------------------------------------------------------- REMOVE IMAGE CONTROL INPUTS
    public function clean_input($inp)
    {
        return key_unset($inp, 'thumb_w, thumb_h, thumb_x, thumb_y, thumb_cw, thumb_ch, thumb_cx, thumb_cy, img_w, img_h, img_x, img_y, img_cw, img_ch, img_cx, img_cy');
    }

// ------------------------------------------------------- GET CURRENT IMAGES (src, orig, thumb)
    public function get_images($input, $img_cell, $path)
    {
        $images = [];

        // GET MAIN IMAGE
        $fpath = APPPATH . '../../' . $path . $input[$img_cell];

        // SAVE IMAGES TO ARRAY
        if (is_file($fpath))
        {
            // GET MAIN IMAGE INFO
            $finfo = pathinfo($fpath);

            $images[$img_cell] = $finfo;

            // GET ADDITIONAL IMAGES (if isset)
            $add = ['orig', 'thumb'];

            foreach ($add as $img)
            {
                $xtra = $finfo['dirname'] . '/' . $finfo['filename'] . '-' . $img . '.' . $finfo['extension'];
                if (is_file($xtra))
                {
                    $images[$img] = pathinfo($xtra);
                }
            }
        }

        return $images;
    }

// ------------------------------------------------------------------------ COPY IMAGE(s)
    public function img_copy($item, $img_cell, $path)
    {
        // GET IMAGES
        $images = $this->get_images($item, $img_cell, $path);

        if (!empty($images))
        {
            foreach ($images as $key => $value)
            {
                // COPY FILE(s)
                copy($images[$key]['dirname'] . '/' . $images[$key]['basename'], $path . $item[$key]);

                // CHANGE INPUTS VALUES
                if (isset($item[$key]))
                {
                    $item[$key] = $value['filename'] . '-copy.' . $value['extension'];
                }
            }
        }
        return $item;
    }

// ------------------------------------------------------------------- MOVE/RENAME IMAGE(S)
    public function img_rename($old, $new, $img_cell, $path, $new_name, $new_path = null)
    {
        // GET IMAGES
        $images = $this->get_images($old, $img_cell, $path);

        if (!empty($images))
        {
            // IF FOLDER CHANGED
            $new_path = ($new_path) ? $new_path : $path;

            // RENAME/MOVE IMAGE(s)
            foreach ($images as $key => $val)
            {
                if ($key === $img_cell)
                {
                    $new[$key] = $new_name . '.' . $val['extension'];
                }

                if ($key === 'thumb')
                {
                    $new[$key] = $new_name . '-thumb.' . $val['extension'];
                }

                if ($key === 'orig')
                {
                    $new[$key] = $new_name . '-orig.' . $val['extension'];
                }

                rename($val['dirname'] . '/' . $val['basename'], $new_path . $new[$key]);

                // Remove origin image from input
                unset($new['orig']);
            }
        }

        return $new;
    }

// ------------------------------------------------------------------------ DELETE IMAGE(s)
    public function img_delete($old, $new, $path, $img_cell = null)
    {
    		$img_cell = $img_cell ?? 'media';

        // GET IMAGES
        $images = $this->get_images($old, $path, $img_cell);

        if (!empty($images))
        {
            foreach ($images as $cell_name => $img_params)
            {
                // REMOVE FILES
                mfile_delete($img_params['dirname'] . '/' . $img_params['basename']);

                // REMOVE FILENAMES FROM INPUTS
                if (isset($old[$cell_name]))
                {
                    $new[$cell_name] = '';
                }
            }
        }
        return $new;
    }
}
