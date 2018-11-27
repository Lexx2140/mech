<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Copy a directory recrusively ( all file and directories inside it )
 *
 * @access    public
 * @param  string  path to source dir
 * @param  string  path to destination dir
 * @return array
 */
function mdir_copy($src, $dest)
{
    if (is_dir($src))
    {
        if (is_dir($dest))
        {
            exit('Папка ' . $dest . ' вже існує');
        }

        // preparing the paths
        $src  = rtrim($src, '/');
        $dest = rtrim($dest, '/');

        // creating the destination directory
        if (!is_dir($dest))
        {
            mkdir($dest, 0777, true);
        }

        // Mapping the directory
        $dir_map = directory_map($src);

        foreach ($dir_map as $key => $value)
        {
            if (is_numeric($key))
            {
                copy($src . '/' . $value, $dest . '/' . $value); //This is a File not a directory
            }
            else
            {
                mdir_copy($src . '/' . $key, $dest . '/' . $key); //this is a directory
            }
        }
    }
}

//=== FOLDER CREATE
function mdir_create()
{
    $dirs = func_get_args();

    foreach ($dirs as $dir)
    {
        if (!is_dir($dir))
        {
            mkdir($dir, 0777, true);
        }
    }
}

//=== FOLDER RENAME
function mdir_rename($old, $new)
{
    if ($new !== $old && is_dir($old))
    {
        if (is_dir($new))
        {
            exit('Папка ' . $new . ' вже існує');
        }
        rename($old, $new);
    }
}

//=== FOLDER DELETE (with all files, recursive)
function mdir_delete($dir)
{
    if (is_dir($dir))
    {
        $files = array_diff(scandir($dir), array('.', '..'));

        foreach ($files as $file)
        {
            $link = $dir . '/' . $file;
            (is_dir($link)) ? mdir_delete($link) : unlink($link);
        }
        return rmdir($dir);
    }
}

//=== FILE DELETE (multiple files in array)
function mfile_delete()
{
    foreach (func_get_args() as $file)
    {
        if (is_file($file))
        {
            unlink($file);
        }
    }

    return true;
}
