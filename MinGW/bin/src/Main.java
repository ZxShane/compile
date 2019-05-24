import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.lang.reflect.Field;

public class Main {

    public static void main(String[] args) {
        String path = System.getProperty("user.dir");

        String file_path = path.replace("\\MinGW\\bin", "");
        file_path += "\\result";

        if (args.length < 1) {
            System.out.println("wrong instruction format");
        }
        else if (args[0].equals("-bin")) {

            //检查文件是否存在
            File com = new File(file_path, "com.s");

            if (!com.exists()) {
                System.out.println("error: .s 文件不存在");
                return;
            }

            String[] ss = {path + "./gcc.exe", "-c", file_path + "./com.s", "-o", file_path + "./bin.o"};

            try {
                //执行exe  cmd可以为字符串(exe存放路径)也可为数组，调用exe时需要传入参数时，可以传数组调用(参数有顺序要求)
                Process p = Runtime.getRuntime().exec(ss);
                String line = null;
                BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));

                BufferedReader brError = new BufferedReader(new InputStreamReader(p.getErrorStream()));
                while ((line = br.readLine()) != null || (line = brError.readLine()) != null) {

                    //输出exe输出的信息以及错误信息
                    System.out.println(line);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {

            }

            String[] s = {path + "./gcc.exe", file_path + "./bin.o", "-o", file_path + "./bin.exe"};
            try {
                //执行exe  cmd可以为字符串(exe存放路径)也可为数组，调用exe时需要传入参数时，可以传数组调用(参数有顺序要求)
                Process p = Runtime.getRuntime().exec(s);
                String line = null;
                BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));

                BufferedReader brError = new BufferedReader(new InputStreamReader(p.getErrorStream()));
                while ((line = br.readLine()) != null || (line = brError.readLine()) != null) {

                    //输出exe输出的信息以及错误信息
                    System.out.println(line);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {

            }

        }
        else if (args[0].equals("-run")) {

            String ss = file_path+"./bin.exe";
            try {
                //执行exe  cmd可以为字符串(exe存放路径)也可为数组，调用exe时需要传入参数时，可以传数组调用(参数有顺序要求)
                Process p = Runtime.getRuntime().exec(ss);
                String line = null;
                BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));

                BufferedReader brError = new BufferedReader(new InputStreamReader(p.getErrorStream()));
                while ((line = br.readLine()) != null || (line = brError.readLine()) != null) {
                    //输出exe输出的信息以及错误信息
                    System.out.println(line);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {

            }
        }
        else {
            System.out.println("wrong instruction format");
            return;
        }
    }
}
